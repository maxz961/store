import { IsString, MaxLength } from 'class-validator';

export class AdminReplyDto {
  @IsString()
  @MaxLength(2000)
  reply: string;
}
