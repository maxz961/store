import { IsString, IsOptional, IsNotEmpty, MaxLength, Matches } from 'class-validator';


export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug должен содержать только строчные буквы, цифры и дефисы' })
  @MaxLength(50)
  slug: string;

  @IsOptional()
  @IsString()
  color?: string;
}
