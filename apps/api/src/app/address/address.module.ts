import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Person } from "../person/entities/person.entity";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { Address } from "./entities/address.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Address, Person])],
  providers: [AddressService],
  controllers: [AddressController],
  exports: [AddressService],
})
export class AddressModule {}
