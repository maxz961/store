import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { CategoriesModule } from "./categories/categories.module";
import { TagsModule } from "./tags/tags.module";
import { OrdersModule } from "./orders/orders.module";
import { AnalyticsModule } from "./analytics/analytics.module";

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
  ],
})
export class AppModule {}
