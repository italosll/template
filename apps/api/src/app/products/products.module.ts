import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { Category } from "../categories/entities/category.entity";
import { CommonModule } from "../common/common.module";
import { S3FilesService } from "../common/files/s3-files.service";
import { S3FilesCloudflareR2Service } from "../common/files/s3-files-cloudflare-r2.service";

@Module({
  imports:[
    TypeOrmModule.forFeature([Product, Category]),
    CommonModule
  ],
  providers:[
    ProductsService,
    { provide: S3FilesService, useClass: S3FilesCloudflareR2Service }
  ],
  controllers:[ProductsController]
})
export class ProductsModule{}
