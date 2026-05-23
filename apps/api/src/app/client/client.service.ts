import { CreateDefaultResponseDTO } from "@api/common/dto/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "@api/common/dto/update-default-response.dto";
import { EntityService } from "@api/common/services/entity.service";
import { HTTP_ERROR_MESSAGES } from "@api/common/utils/http-error-messages.util";
import { PersonLegal } from "@api/person/entities/person-legal.entity";
import { PersonNatural } from "@api/person/entities/person-natural.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateClientDTO } from "./dto/create-client.dto";
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
    @InjectRepository(PersonLegal)
    private readonly _personLegalRepository: Repository<PersonLegal>,
    @InjectRepository(PersonNatural)
    private readonly _personNaturalRepository: Repository<PersonNatural>
  ) {}

  async findAll(params: {
    textToSearch?: string;
    id?: number;
  }): Promise<ResponseClientDTO[]> {
    const queryBuilder = this._clientRepository.createQueryBuilder("client");

    const queriesParameters = getQueriesParameters();
    queryBuilder.andWhereMultipleColumns(params, queriesParameters);

    const clients = await queryBuilder.getMany();
    return clients as ResponseClientDTO[];
  }

  async create(createClient: CreateClientDTO): Promise<CreateDefaultResponseDTO> {
    const hasLegal = !!createClient.personLegalId;
    const hasNatural = !!createClient.personNaturalId;

    if (hasLegal === hasNatural) {
      throw new HttpException(
        "Cliente deve referenciar uma pessoa física ou uma pessoa jurídica. Não ambos",
        HttpStatus.BAD_REQUEST
      );
    }

        if (!hasLegal  && !hasNatural) {
      throw new HttpException(
        "Cliente deve referenciar uma pessoa física ou uma pessoa jurídica. Não nenhum dos dois",
        HttpStatus.BAD_REQUEST
      );
    }

    if (hasLegal) {
      const legalPerson = await this._personLegalRepository.findOneBy({
        id: createClient.personLegalId,
      });

      if (!legalPerson) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
      }

      const existingClient = await this._clientRepository.findOneBy({
        personLegalId: createClient.personLegalId,
      });

      if (existingClient) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.alreadyExists(),
          HttpStatus.CONFLICT
        );
      }
    }

    if (hasNatural) {
      const naturalPerson = await this._personNaturalRepository.findOneBy({
        id: createClient.personNaturalId,
      });

      if (!naturalPerson) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
      }

      const existingClient = await this._clientRepository.findOneBy({
        personNaturalId: createClient.personNaturalId,
      });

      if (existingClient) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.alreadyExists(),
          HttpStatus.CONFLICT
        );
      }
    }

    const entity = this._clientRepository.create(createClient);
    const created = await this._clientRepository.save(entity);
    return { id: created.id };
  }

  async update(updateClient?: UpdateClientDTO): Promise<UpdateDefaultResponseDTO> {
    const registeredClient = await this._clientRepository.findOneBy({
      id: updateClient?.id,
    });

    if (!registeredClient) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

    const merged = this._clientRepository.merge(
      registeredClient,
      updateClient ?? {}
    );

    if (updateClient?.personLegalId && !updateClient?.personNaturalId) {
      merged.personNaturalId = undefined;
    }

    if (updateClient?.personNaturalId && !updateClient?.personLegalId) {
      merged.personLegalId = undefined;
    }

    const hasLegal = !!merged.personLegalId;
    const hasNatural = !!merged.personNaturalId;

    if (hasLegal === hasNatural) {
      throw new HttpException(
        "Client must reference either a legal person or a natural person.",
        HttpStatus.BAD_REQUEST
      );
    }

    if (hasLegal) {
      const legalPerson = await this._personLegalRepository.findOneBy({
        id: merged.personLegalId,
      });

      if (!legalPerson) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
      }

      const existingClient = await this._clientRepository.findOneBy({
        personLegalId: merged.personLegalId,
      });

      if (existingClient && existingClient.id !== registeredClient.id) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.alreadyExists(),
          HttpStatus.CONFLICT
        );
      }
    }

    if (hasNatural) {
      const naturalPerson = await this._personNaturalRepository.findOneBy({
        id: merged.personNaturalId,
      });

      if (!naturalPerson) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
      }

      const existingClient = await this._clientRepository.findOneBy({
        personNaturalId: merged.personNaturalId,
      });

      if (existingClient && existingClient.id !== registeredClient.id) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.alreadyExists(),
          HttpStatus.CONFLICT
        );
      }
    }

    await this._clientRepository.save(merged);
    return { id: registeredClient.id };
  }

  async delete(ids: number[]) {
    const clients = await this._clientRepository.find();

    for (const id of ids) {
      const registeredClient = clients?.find((client) => client.id === id);
      if (!registeredClient)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
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
          HttpStatus.NOT_FOUND
        );
    }

    await this._clientRepository.delete({ id: In(ids) });
    return { ids };
  }
}
