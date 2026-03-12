import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsPositive,
  IsInt,
  IsDateString,
  IsEnum,
  Min,
  Matches,
} from "class-validator";
import { Type } from "class-transformer";

export class CreatePromotionDto {
  @IsString()
  title: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens",
  })
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  bannerImageUrl: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/, { message: "Must be a valid hex color (#RRGGBB)" })
  bannerBgColor?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(["PERCENTAGE", "FIXED"] as const)
  discountType: "PERCENTAGE" | "FIXED";

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  discountValue: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  position?: number;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];
}
