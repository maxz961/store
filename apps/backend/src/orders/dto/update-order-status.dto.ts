import { IsEnum } from "class-validator";
import { OrderStatus } from "@store/shared";

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
