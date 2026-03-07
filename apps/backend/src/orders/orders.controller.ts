import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { Role, OrderStatus } from "@store/shared";
import type { User } from "@store/shared";

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@GetUser() user: User, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get("my")
  findMy(@GetUser() user: User) {
    return this.ordersService.findAllForUser(user.id);
  }

  @Get("admin")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("status") status?: OrderStatus
  ) {
    return this.ordersService.findAll(page, limit, status);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findById(id);
  }

  @Put(":id/status")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateStatus(@Param("id") id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
