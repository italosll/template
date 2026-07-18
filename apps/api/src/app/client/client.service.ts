import { EntityService } from "@api/common/services/entity.service";
import { HTTP_ERROR_MESSAGES } from "@api/common/utils/http-error-messages.util";
import { PersonLegal } from "@api/person/entities/person-legal.entity";
import { PersonNatural } from "@api/person/entities/person-natural.entity";
import { Person } from "@api/person/entities/person.entity";
import { CreateDefaultResponseDTO } from "@interfaces/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "@interfaces/update-default-response.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { CreateClientDTO } from "./dto/create-client.dto";
import { ResponseClientLookupDTO } from "./dto/response-client-lookup.dto";
import { ResponseClientDTO } from "./dto/response-client.dto";
import { UpdateClientDTO } from "./dto/update-client.dto";
import { Client } from "./entities/client.entity";
import { getQueriesParameters } from "./utils/get-queries-parameters.util";

@Injectable()
export class ClientService
  implements EntityService<ResponseClientDTO, CreateClientDTO, UpdateClientDTO>
{
  constructor(
    @InjectRepository(Client)
    private readonly _clientRepository: Repository<Client>,
    @InjectDataSource() private readonly _dataSource: DataSource,
  ) {}

  async findAll(params: {
    textToSearch?: string;
    id?: number;
  }): Promise<ResponseClientDTO[]> {
    const queryBuilder = this._clientRepository.createQueryBuilder("client");
    const queriesParameters = getQueriesParameters();

    const clients = (await queryBuilder
      .andWhereMultipleColumns(params, queriesParameters)
      .leftJoinAndSelect("client.personNatural", "personNatural")
      .leftJoinAndSelect("personNatural.personId", "naturalPerson")
      .leftJoinAndSelect("client.personLegal", "personLegal")
      .leftJoinAndSelect("personLegal.personId", "legalPerson")
      .getMany()) as (Client & {
      personNatural: PersonNatural & { personId: Person };
      personLegal: PersonLegal & { personId: Person };
    })[];

    console.log(clients.at(-1));
    const mappedClients = clients.map((client) => {
      if (client.personNatural) {
        return {
          id: client?.id,
          name: client?.personNatural?.personId?.name,
          email: client?.personNatural?.personId?.email,
          phoneNumber: client?.personNatural?.personId?.phoneNumber,
          document: client?.personNatural?.document,
          personId: client?.personNatural?.personId?.id,
          personNaturalId: client?.personNaturalId,
          tenantId: client?.personNatural?.tenantId,
          birthDate: client?.personNatural?.birthDate,
          deletedAt: client?.deletedAt,
          recoveryAt: client?.recoveredAt,
          updatedAt: client?.updatedAt,
          createdAt: client?.createdAt,
        } as Omit<PersonNatural, "setRecoveredAt">;
      }

      if (client.personLegal) {
        return {
          id: client?.id,
          name: client?.personLegal?.personId?.name,
          email: client?.personLegal?.personId?.email,
          phoneNumber: client?.personLegal?.personId?.phoneNumber,
          document: client?.personLegal?.document,
          companyRealName: client?.personLegal?.companyRealName,
          personId: client?.personLegal?.personId?.id,
          personLegalId: client?.personLegalId,
          tenantId: client?.personLegal?.tenantId,
          deletedAt: client?.deletedAt,
          recoveryAt: client?.recoveredAt,
          updatedAt: client?.updatedAt,
          createdAt: client?.createdAt,
        } as Omit<PersonLegal, "setRecoveredAt">;
      }

      return null;
    });

    return mappedClients as (PersonLegal | PersonNatural)[];
  }

  async lookup(): Promise<ResponseClientLookupDTO[]> {
    const queryBuilder = this._clientRepository.createQueryBuilder("client");
    const queriesParameters = getQueriesParameters();

    const clients = (await queryBuilder
      .leftJoinAndSelect("client.personNatural", "personNatural")
      .leftJoinAndSelect("personNatural.personId", "naturalPerson")
      .leftJoinAndSelect("client.personLegal", "personLegal")
      .leftJoinAndSelect("personLegal.personId", "legalPerson")
      .select([
        "client.id",
        "personNatural.id",
        "naturalPerson.id",
        "naturalPerson.name",
        "personLegal.id",
        "legalPerson.id",
        "legalPerson.name",
      ])
      .getMany()) as (Client & {
      personNatural?: PersonNatural & { personId: Person };
      personLegal?: PersonLegal & { personId: Person };
    })[];

    return clients
      .map((client) => {
        const description =
          client.personNatural?.personId?.name ??
          client.personLegal?.personId?.name;

        if (!description) {
          return null;
        }

        return {
          id: client.id,
          description,
        };
      })
      .filter((client): client is ResponseClientLookupDTO => client !== null);
  }

  async create(
    createClient: CreateClientDTO,
  ): Promise<CreateDefaultResponseDTO> {
    const hasLegal = !!createClient.personLegal;
    const hasNatural = !!createClient.personNatural;

    if (hasLegal === hasNatural) {
      throw new HttpException(
        "Cliente deve informar dados de pessoa fisica ou juridica. Nao ambos.",
        HttpStatus.BAD_REQUEST,
      );
    }

    return this._dataSource.transaction(async (manager) => {
      const clientRepository = manager.getRepository(Client);
      const personRepository = manager.getRepository(Person);
      const personLegalRepository = manager.getRepository(PersonLegal);
      const personNaturalRepository = manager.getRepository(PersonNatural);

      if (hasLegal) {
        const personLegal = createClient.personLegal!;
        const existingLegal = await personLegalRepository.findOne({
          where: { document: personLegal.document },
        });

        if (existingLegal) {
          throw new HttpException(
            HTTP_ERROR_MESSAGES.alreadyExists(),
            HttpStatus.CONFLICT,
          );
        }

        if (!hasLegal && !hasNatural) {
          throw new HttpException(
            "Cliente deve informar dados da pessoa fisica ou juridica.",
            HttpStatus.BAD_REQUEST,
          );
        }

        const person = await personRepository.save(
          personRepository.create({
            name: personLegal.name,
            email: personLegal.email,
            phoneNumber: personLegal.phoneNumber,
          }),
        );

        const legal = await personLegalRepository.save(
          personLegalRepository.create({
            companyRealName: personLegal.companyRealName,
            document: personLegal.document,
            personId: person.id,
          }),
        );

        const client = await clientRepository.save(
          clientRepository.create({ personLegalId: legal.id }),
        );

        return { id: client.id };
      }

      const personNatural = createClient.personNatural!;
      const existingNatural = await personNaturalRepository.findOne({
        where: { document: personNatural.document },
      });

      if (existingNatural) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.alreadyExists(),
          HttpStatus.CONFLICT,
        );
      }

      const person = await personRepository.save(
        personRepository.create({
          name: personNatural.name,
          email: personNatural.email,
          phoneNumber: personNatural.phoneNumber,
        }),
      );

      const natural = await personNaturalRepository.save(
        personNaturalRepository.create({
          document: personNatural.document,
          birthDate: personNatural.birthDate,
          personId: person.id,
        }),
      );

      const client = await clientRepository.save(
        clientRepository.create({ personNaturalId: natural.id }),
      );

      return { id: client.id };
    });
  }

  async update(
    updateClient: UpdateClientDTO,
  ): Promise<UpdateDefaultResponseDTO> {
    const hasLegal = !!updateClient.personLegal;
    const hasNatural = !!updateClient.personNatural;

    if (hasLegal === hasNatural) {
      throw new HttpException(
        "Cliente deve informar dados de pessoa fisica ou juridica. Nao ambos.",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!hasLegal && !hasNatural) {
      throw new HttpException(
        "Cliente deve informar dados da pessoa fisica ou juridica.",
        HttpStatus.BAD_REQUEST,
      );
    }

    return this._dataSource.transaction(async (manager) => {
      const clientRepository = manager.getRepository(Client);
      const personRepository = manager.getRepository(Person);
      const personLegalRepository = manager.getRepository(PersonLegal);
      const personNaturalRepository = manager.getRepository(PersonNatural);

      const registeredClient = await clientRepository.findOneBy({
        id: updateClient.id,
      });

      if (!registeredClient) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND,
        );
      }

      if (hasLegal) {
        if (!registeredClient.personLegalId) {
          throw new HttpException(
            "Cliente nao possui pessoa juridica vinculada.",
            HttpStatus.BAD_REQUEST,
          );
        }

        const personLegal = await personLegalRepository.findOneBy({
          id: registeredClient.personLegalId,
        });

        if (!personLegal) {
          throw new HttpException(
            HTTP_ERROR_MESSAGES.notFound(),
            HttpStatus.NOT_FOUND,
          );
        }

        const person = await personRepository.findOneBy({
          id: personLegal.personId,
        });

        if (!person) {
          throw new HttpException(
            HTTP_ERROR_MESSAGES.notFound(),
            HttpStatus.NOT_FOUND,
          );
        }

        const legalPayload = updateClient.personLegal!;
        const existingLegal = await personLegalRepository.findOne({
          where: { document: legalPayload.document },
        });

        if (existingLegal && existingLegal.id !== personLegal.id) {
          throw new HttpException(
            HTTP_ERROR_MESSAGES.alreadyExists(),
            HttpStatus.CONFLICT,
          );
        }

        personRepository.merge(person, {
          name: legalPayload.name,
          email: legalPayload.email,
          phoneNumber: legalPayload.phoneNumber,
        });

        personLegalRepository.merge(personLegal, {
          companyRealName: legalPayload.companyRealName,
          document: legalPayload.document,
        });

        await personRepository.save(person);
        await personLegalRepository.save(personLegal);
      }

      if (hasNatural) {
        if (!registeredClient.personNaturalId) {
          throw new HttpException(
            "Cliente nao possui pessoa fisica vinculada.",
            HttpStatus.BAD_REQUEST,
          );
        }

        const personNatural = await personNaturalRepository.findOneBy({
          id: registeredClient.personNaturalId,
        });

        if (!personNatural) {
          throw new HttpException(
            HTTP_ERROR_MESSAGES.notFound(),
            HttpStatus.NOT_FOUND,
          );
        }

        const person = await personRepository.findOneBy({
          id: personNatural.personId,
        });

        if (!person) {
          throw new HttpException(
            HTTP_ERROR_MESSAGES.notFound(),
            HttpStatus.NOT_FOUND,
          );
        }

        const naturalPayload = updateClient.personNatural!;
        const existingNatural = await personNaturalRepository.findOne({
          where: { document: naturalPayload.document },
        });

        if (existingNatural && existingNatural.id !== personNatural.id) {
          throw new HttpException(
            HTTP_ERROR_MESSAGES.alreadyExists(),
            HttpStatus.CONFLICT,
          );
        }

        personRepository.merge(person, {
          name: naturalPayload.name,
          email: naturalPayload.email,
          phoneNumber: naturalPayload.phoneNumber,
        });

        personNaturalRepository.merge(personNatural, {
          document: naturalPayload.document,
          birthDate: naturalPayload.birthDate,
        });

        await personRepository.save(person);
        await personNaturalRepository.save(personNatural);
      }

      return { id: registeredClient.id };
    });
  }

  async delete(ids: number[]) {
    const clients = await this._clientRepository.find();

    for (const id of ids) {
      const registeredClient = clients?.find((client) => client.id === id);
      if (!registeredClient)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND,
        );
    }

    await this._clientRepository.softDelete({ id: In(ids) });
    return { ids };
  }

  async hardDelete(ids: number[]) {
    const clients = await this._clientRepository.find();

    for (const id of ids) {
      const registeredClient = clients?.find((client) => client.id === id);
      if (!registeredClient)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND,
        );
    }

    await this._clientRepository.delete({ id: In(ids) });
    return { ids };
  }
}
