import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '@store/shared';
import type { User } from '@store/shared';


@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  getMyMessages(@GetUser() user: User) {
    return this.supportService.getMyMessages(user.id);
  }

  @Post('messages')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  sendMessage(@GetUser() user: User, @Body() dto: SendMessageDto) {
    return this.supportService.sendMessage(user.id, dto);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  getUnreadCount(@GetUser() user: User) {
    return this.supportService.getUnreadCount(user.id);
  }

  @Get('admin/unread-count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminGetTotalUnreadCount() {
    return this.supportService.adminGetTotalUnreadCount();
  }

  @Get('admin/threads')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminGetThreads() {
    return this.supportService.adminGetThreads();
  }

  @Get('admin/threads/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminGetMessages(@Param('userId') userId: string) {
    return this.supportService.adminGetMessages(userId);
  }

  @Post('admin/threads/:userId/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  adminReply(@Param('userId') userId: string, @Body() dto: SendMessageDto) {
    return this.supportService.adminReply(userId, dto);
  }
}
