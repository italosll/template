import { Module } from "@nestjs/common";
import { EncryptionService } from "./encryption/encryption.service";
import { CryptoService } from "./encryption/crypto.service";
import { S3FilesService } from "./files/s3-files.service";
import { S3FilesCloudflareR2Service } from "./files/s3-files-cloudflare-r2.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports:[ConfigModule],
  providers:[
    {provide: EncryptionService, useClass: CryptoService},
    {provide: S3FilesService, useClass: S3FilesCloudflareR2Service},
  ]
})
export class CommonModule{}
