# Library Management System

A NestJS API with a PostgreSQL database (hosted on Supabase) managed through Prisma. This repo covers the data layer for the library's book catalog.

## Tech Stack
- NestJS (API)
- Prisma ORM
- PostgreSQL (Supabase)

## Setup
1. `cd api`
2. `npm install`
3. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string
4. `npx prisma migrate dev`
5. `npx prisma db seed`

## Schema Decisions

**Why Book references Genre instead of embedding it**

Each `Book` stores a `genreId` foreign key that points to a row in the `Genre` table, using a Prisma `@relation`. It does not copy the genre's name into every book. I chose this because:

- **One source of truth.** A genre's name lives in one row. Renaming "Sci-Fi" to "Science Fiction" is one update, not an update to every matching book.
- **No inconsistent data.** Embedded text invites typos and variants ("Fantasy", "fantasy", "Fantasi"). A foreign key means a book can only belong to a genre that actually exists.
- **Easy queries.** I can list all books in a genre, count books per genre, or list all genres without scanning every book.
- **Genres exist independently.** A genre can be created before any book uses it and kept when its books are removed.

**Other decisions**
- `Role` is an enum (`PATRON`, `LIBRARIAN`) so a user's role can only be one of the allowed values. It defaults to `PATRON`.
- `isbn` is optional but unique, so two books can't share one.
- `Genre.name` is unique to prevent duplicate genres.
- `@@index([genreId])` speeds up looking up books by genre.# library-management-system