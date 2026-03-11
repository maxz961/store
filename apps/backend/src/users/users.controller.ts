import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '@store/shared';
import type { User } from '@store/shared';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @GetUser() currentUser: User,
  ) {
    return this.usersService.updateRole(id, dto.role, currentUser.id);
  }

  @Patch(':id/ban')
  setBanned(
    @Param('id') id: string,
    @Body() dto: BanUserDto,
    @GetUser() currentUser: User,
  ) {
    return this.usersService.setBanned(id, dto.isBanned, currentUser.id);
  }
}
