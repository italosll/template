import { ALREADY_EXISTS } from "@api/common/constants/error-messages.constant";
import { CreateDefaultResponseDTO } from "@api/common/dto/create-default-response.dto";
import { PersonLegalContract } from "@interfaces/person.contract";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PersonLegal } from "../entities/person-legal.entity";
import { Person } from "../entities/person.entity";
import { getQueriesParameters } from "../utils/get-queries-parameters.util";

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    // @InjectRepository(Person)
    // private readonly personLegalRepository: Repository<PersonLegal>,
    // @InjectRepository(Person)
    // private readonly personNaturalRepository: Repository<PersonNatural>,
    @InjectDataSource() private readonly datasource: DataSource
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

  async create(
    personLegal: PersonLegalContract
  ): Promise<CreateDefaultResponseDTO> {
    return this.datasource.transaction(async (manager) => {
      const personRepository = manager.getRepository(Person);
      const personLegalRepository = manager.getRepository(PersonLegal);

      const existingPerson = await personRepository.findOne({
        where: { document: personLegal.document },
      });

      if (existingPerson) {
        throw new HttpException(ALREADY_EXISTS, HttpStatus.CONFLICT);
      }

      const newPerson = await personRepository.save(personLegal);
      await personLegalRepository.save({
        ...personLegal,
        personId: newPerson.id,
      });

      return { id: newPerson.id };
    });
  }
}
