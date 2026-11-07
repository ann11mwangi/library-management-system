import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const catalog: Record<
  string,
  { title: string; author: string; publishedYear: number }[]
> = {
  'Science Fiction': [
    { title: 'Dune', author: 'Frank Herbert', publishedYear: 1965 },
    { title: 'Neuromancer', author: 'William Gibson', publishedYear: 1984 },
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', publishedYear: 1969 },
    { title: 'Foundation', author: 'Isaac Asimov', publishedYear: 1951 },
  ],
  Fantasy: [
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937 },
    { title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', publishedYear: 1968 },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', publishedYear: 2007 },
    { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson', publishedYear: 2006 },
  ],
  Mystery: [
    { title: 'Gone Girl', author: 'Gillian Flynn', publishedYear: 2012 },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', publishedYear: 2005 },
    { title: 'And Then There Were None', author: 'Agatha Christie', publishedYear: 1939 },
    { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', publishedYear: 1902 },
  ],
  'Non-Fiction': [
    { title: 'Sapiens', author: 'Yuval Noah Harari', publishedYear: 2011 },
    { title: 'Educated', author: 'Tara Westover', publishedYear: 2018 },
    { title: 'Atomic Habits', author: 'James Clear', publishedYear: 2018 },
    { title: 'The Immortal Life of Henrietta Lacks', author: 'Rebecca Skloot', publishedYear: 2010 },
  ],
};

async function main() {
  // Clear books first so re-running the seed never creates duplicates.
  await prisma.book.deleteMany();

  for (const [genreName, books] of Object.entries(catalog)) {
    const genre = await prisma.genre.upsert({
      where: { name: genreName },
      update: {},
      create: { name: genreName },
    });

    await prisma.book.createMany({
      data: books.map((book) => ({ ...book, genreId: genre.id })),
    });
  }

  await prisma.user.upsert({
    where: { email: 'librarian@example.com' },
    update: {},
    create: { email: 'librarian@example.com', name: 'Lena Librarian', role: Role.LIBRARIAN },
  });
  await prisma.user.upsert({
    where: { email: 'patron@example.com' },
    update: {},
    create: { email: 'patron@example.com', name: 'Pat Patron', role: Role.PATRON },
  });

  const [genres, books] = await Promise.all([prisma.genre.count(), prisma.book.count()]);
  console.log(`Seeded ${genres} genres and ${books} books.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
