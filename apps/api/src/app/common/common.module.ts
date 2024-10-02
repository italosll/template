import { Module } from "@nestjs/common";
import { HashService } from "./services/hash.service";
import { EncryptionService } from "./services/encryption.service";

@Module({
  providers:[
    HashService,
    EncryptionService
  ]
})
export class CommonModule{}
