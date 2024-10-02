import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { CommonModule } from "../common/common.module";
import { HashService } from "../common/services/hash.service";
import { EncryptionService } from "../common/services/encryption.service";

@Module({
  imports:[
    CommonModule,
    TypeOrmModule.forFeature([User])],
  providers:[UsersService, HashService, EncryptionService],
  controllers:[UsersController],

})
export class  UsersModule{}
