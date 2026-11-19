import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class CreateBookDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() author: string;
  @IsString() @Length(10, 17) isbn: string;
  @IsInt() @Min(1) totalCopies: number;
  @IsInt() genreId: number;
}
