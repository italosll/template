import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "../common/common.module";
import { S3FilesService } from "../common/files/s3-files.service";
import { S3FilesCloudflareR2Service } from "../common/files/s3-files-cloudflare-r2.service";
import { Company } from "./entities/companies.entity";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";

@Module({
  imports:[
    TypeOrmModule.forFeature([Company]),
    CommonModule
  ],
  providers:[
    CompaniesService,
    { provide: S3FilesService, useClass: S3FilesCloudflareR2Service }
  ],
  controllers:[CompaniesController]
})
export class CompanyModule{}
