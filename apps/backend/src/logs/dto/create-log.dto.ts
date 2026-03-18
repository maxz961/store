import { IsString, IsOptional, MaxLength } from 'class-validator';


export class CreateLogDto {
  @IsString()
  @MaxLength(2000)
  message: string;

  @IsString()
  @IsOptional()
  stack?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  url?: string;
}
