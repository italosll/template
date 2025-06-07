import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonLegal } from "./entities/person-legal.entity";
import { PersonNatural } from "./entities/person-natural.entity";
import { Person } from "./entities/person.entity";
import { PersonService } from "./services/person.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Person]),
    TypeOrmModule.forFeature([PersonLegal]),
    TypeOrmModule.forFeature([PersonNatural]),
  ],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
