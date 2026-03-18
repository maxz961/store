import { IsNumber, IsOptional, IsString, Min } from 'class-validator';


export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;
}
