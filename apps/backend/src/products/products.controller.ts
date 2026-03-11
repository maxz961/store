import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ProductsService } from "./products.service";
import { UploadService } from "../upload/upload.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductFiltersDto } from "./dto/product-filters.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "@store/shared";

const BUCKET = 'product-images';

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  findAll(@Query() filters: ProductFiltersDto) {
    return this.productsService.findAll(filters, false);
  }

  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAllAdmin(@Query() filters: ProductFiltersDto) {
    return this.productsService.findAll(filters, true);
  }

  @Get("admin/image-error-count")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getImageErrorCount() {
    return this.productsService.getImageErrorCount();
  }

  @Patch(":id/image-error")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  reportImageError(@Param("id") id: string) {
    return this.productsService.reportImageError(id);
  }

  @Get("price-range")
  getPriceRange() {
    return this.productsService.getPriceRange();
  }

  @Get(":slug/similar")
  findSimilar(@Param("slug") slug: string) {
    return this.productsService.findSimilar(slug);
  }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 6))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await Promise.all(
      files.map((file) => this.uploadService.uploadFile(BUCKET, file)),
    );
    return { urls };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
