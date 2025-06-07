import { PersonLegalContract } from "@interfaces/person.contract";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Person } from "../entities/person.entity";
import { getQueriesParameters } from "../utils/get-queries-parameters.util";

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>
  ) {}

  async findAll(personLegal?: Partial<PersonLegalContract>): Promise<Person[]> {
    const queryBuilder =
      this.personRepository.createQueryBuilder("personLegal");
    const queriesParameters = getQueriesParameters();

    queryBuilder.andWhereMultipleColumns(personLegal ?? {}, queriesParameters);

    const persons = await queryBuilder
      .loadRelationIdAndMap("personLegal.personId", "personLegal.personId")
      .getMany();

    return persons;
  }

  async delete(ids: number[]): Promise<{ ids: number[] }> {
    const people = await this.personRepository.find();
    ids.forEach((id) => {
      const registeredPerson = people?.find((p) => p.id === id);
      if (!registeredPerson)
        throw new HttpException(
          `Person not found | idNotFound:${id}`,
          HttpStatus.NOT_FOUND
        );
    });
    await this.personRepository.softDelete({ id: In(ids) });
    return { ids };
  }

  async hardDelete(ids: number[]): Promise<{ ids: number[] }> {
    const people = await this.personRepository.find();
    ids.forEach((id) => {
      const registeredPerson = people?.find((p) => p.id === id);
      if (!registeredPerson)
        throw new HttpException(
          `Person not found | idNotFound:${id}`,
          HttpStatus.NOT_FOUND
        );
    });
    await this.personRepository.delete({ id: In(ids) });
    return { ids };
  }
}
