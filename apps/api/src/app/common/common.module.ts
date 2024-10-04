import { Module } from "@nestjs/common";
import { EncryptionService } from "./encryption/encryption.service";
import { CryptoService } from "./encryption/crypto.service";

@Module({
  providers:[
    {provide: EncryptionService, useClass: CryptoService}
  ]
})
export class CommonModule{}
