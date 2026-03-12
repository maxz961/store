import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { CategoriesModule } from "./categories/categories.module";
import { TagsModule } from "./tags/tags.module";
import { OrdersModule } from "./orders/orders.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { UploadModule } from "./upload/upload.module";
import { PromotionsModule } from "./promotions/promotions.module";
import { SupportModule } from "./support/support.module";
import { LogsModule } from "./logs/logs.module";
import { FavoritesModule } from "./favorites/favorites.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    TagsModule,
    OrdersModule,
    AnalyticsModule,
    ReviewsModule,
    UploadModule,
    PromotionsModule,
    SupportModule,
    LogsModule,
    FavoritesModule,
  ],
})
export class AppModule {}
