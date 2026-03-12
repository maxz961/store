import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { FavoritesService } from './favorites.service';
import type { User } from '@store/shared';


@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(@GetUser() user: User) {
    return this.favoritesService.findAllForUser(user.id);
  }

  @Get('ids')
  getIds(@GetUser() user: User) {
    return this.favoritesService.getProductIds(user.id);
  }

  @Post(':productId')
  add(@GetUser() user: User, @Param('productId') productId: string) {
    return this.favoritesService.add(user.id, productId);
  }

  @Delete(':productId')
  remove(@GetUser() user: User, @Param('productId') productId: string) {
    return this.favoritesService.remove(user.id, productId);
  }
}
