import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { Tenant } from "@api/iam/entities/tenant.entity";

@Module({
  imports:[
    TypeOrmModule.forFeature([Category, Tenant])
  ],
  providers:[ CategoriesService],
  controllers: [ CategoriesController ],
  exports: [ CategoriesService ]

})
export class CategoriesModule{}
