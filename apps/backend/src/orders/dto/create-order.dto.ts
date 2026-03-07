import { IsEnum, IsArray, IsObject, IsString, IsNumber, Min, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
import { DeliveryMethod } from "@store/shared";

class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}

class ShippingAddressDto {
  @IsString()
  fullName: string;

  @IsString()
  line1: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;
}

export class CreateOrderDto {
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ArrayMinSize(1)
  items: OrderItemDto[];
}
