import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonLegal } from "@api/person/entities/person-legal.entity";
import { PersonNatural } from "@api/person/entities/person-natural.entity";
import { Person } from "@api/person/entities/person.entity";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { Client } from "./entities/client.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Client, Person, PersonLegal, PersonNatural])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
