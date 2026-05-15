import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
 
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { CommonModule } from "../common/common.module";
import { CryptoService } from "../common/encryption/crypto.service";
import { EncryptionService } from "../common/encryption/encryption.service";
import { HashingService } from "../iam/hashing/hashing.service";
import { BcryptService } from "../iam/hashing/bcrypt.service";
import { User } from "./entities/user.entity";
import { Tenant } from "@api/iam/entities/tenant.entity";

@Module({
  imports:[
    CommonModule,
    TypeOrmModule.forFeature([User,Tenant])],
  providers:[
    UsersService,
    { provide: HashingService, useClass: BcryptService },
    { provide: EncryptionService, useClass: CryptoService }
   ],
  controllers:[UsersController],

})
export class  UsersModule{}
  