import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReviewsService } from './reviews.service';
import { UploadService } from '../upload/upload.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AdminReplyDto } from './dto/admin-reply.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '@store/shared';
import type { User } from '@store/shared';

const BUCKET = 'review-images';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await Promise.all(
      files.map((file) => this.uploadService.uploadFile(BUCKET, file)),
    );
    return { urls };
  }

  @Post(':productId')
  @UseGuards(JwtAuthGuard)
  create(
    @GetUser() user: User,
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.id, productId, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.reviewsService.remove(user.id, id);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll(
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findAll(sort, page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  adminRemove(@Param('id') id: string) {
    return this.reviewsService.adminRemove(id);
  }

  @Post('admin/:id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminReply(@Param('id') id: string, @Body() dto: AdminReplyDto) {
    return this.reviewsService.adminReply(id, dto.reply);
  }

  @Delete('admin/:id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  adminRemoveReply(@Param('id') id: string) {
    return this.reviewsService.adminRemoveReply(id);
  }

  @Get('product/:productId')
  findByProduct(
    @Param('productId') productId: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findByProductId(productId, sort, page ? Number(page) : 1, limit ? Number(limit) : 5);
  }

  @Get('my/:productId')
  @UseGuards(JwtAuthGuard)
  getMyReview(
    @GetUser() user: User,
    @Param('productId') productId: string,
  ) {
    return this.reviewsService.getUserReview(user.id, productId);
  }
}
