import { IsString, IsOptional, IsNotEmpty, MaxLength, Matches } from 'class-validator';


export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
  @MaxLength(50)
  slug: string;

  @IsOptional()
  @IsString()
  color?: string;
}
