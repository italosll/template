import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { EntityService } from "../common/services/entity.service";
import { HTTP_ERROR_MESSAGES } from "../common/utils/http-error-messages.util";
import { Person } from "../person/entities/person.entity";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { Address } from "./entities/address.entity";
import { CreateAddressDTO } from "./dto/create-address.dto";
import { UpdateAddressDTO } from "./dto/update-address.dto";
import { ResponseAddressDTO } from "./dto/response-address.dto";
import { AddressContract } from "@interfaces/address.contract";

@Injectable()
export class AddressService
  implements EntityService<ResponseAddressDTO, CreateAddressDTO, UpdateAddressDTO>
{
  constructor(
    @InjectRepository(Address)
    private readonly _addressRepository: Repository<Address>,
    @InjectRepository(Person)
    private readonly _personRepository: Repository<Person>
  ) {}

  async findAll(
    address?: Partial<AddressContract>
  ): Promise<ResponseAddressDTO[]> {
    const queryBuilder = this._addressRepository.createQueryBuilder("address");

    if (address?.id)
      queryBuilder.andWhere("address.id LIKE :id", {
        id: `%${address.id}%`,
      });
    if (address?.streetAddress)
      queryBuilder.andWhere(
        "LOWER(address.streetAddress) LIKE LOWER(:streetAddress)",
        {
          streetAddress: `%${address.streetAddress}%`,
        }
      );
    if (address?.neighborhood)
      queryBuilder.andWhere(
        "LOWER(address.neighborhood) LIKE LOWER(:neighborhood)",
        {
          neighborhood: `%${address.neighborhood}%`,
        }
      );
    if (address?.city)
      queryBuilder.andWhere("LOWER(address.city) LIKE LOWER(:city)", {
        city: `%${address.city}%`,
      });
    if (address?.state)
      queryBuilder.andWhere("LOWER(address.state) LIKE LOWER(:state)", {
        state: `%${address.state}%`,
      });
    if (address?.postalCode)
      queryBuilder.andWhere("address.postalCode LIKE :postalCode", {
        postalCode: `%${address.postalCode}%`,
      });
    if (address?.country)
      queryBuilder.andWhere("LOWER(address.country) LIKE LOWER(:country)", {
        country: `%${address.country}%`,
      });
    if (address?.personId)
      queryBuilder.andWhere("address.personId = :personId", {
        personId: address.personId,
      });

    const addresses = await queryBuilder.getMany();
    return addresses as ResponseAddressDTO[];
  }

  async create(
    createAddress: CreateAddressDTO
  ): Promise<CreateDefaultResponseDTO> {
    const existingAddress = await this._addressRepository.findOneBy({
      personId: createAddress.personId,
    });

    if (existingAddress) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.alreadyExists(),
        HttpStatus.CONFLICT
      );
    }

    const person = await this._personRepository.findOneBy({
      id: createAddress.personId,
    });

    if (!person) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

    const entity = this._addressRepository.create(createAddress);
    entity.person = person;

    const created = await this._addressRepository.save(entity);
    return { id: created.id };
  }

  async update(
    updateAddress?: UpdateAddressDTO
  ): Promise<UpdateDefaultResponseDTO> {
    const registeredAddress = await this._addressRepository.findOneBy({
      id: updateAddress?.id,
    });

    if (!registeredAddress)
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );

    const person = await this._personRepository.findOneBy({
      id: updateAddress?.personId,
    });

    if (!person)
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );

    const anotherAddress = await this._addressRepository.findOneBy({
      personId: updateAddress?.personId,
    });

    if (anotherAddress && anotherAddress.id !== registeredAddress.id) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.alreadyExists(),
        HttpStatus.CONFLICT
      );
    }

    const merged = this._addressRepository.merge(
      registeredAddress,
      updateAddress ?? {}
    );
    merged.person = person;

    await this._addressRepository.save(merged);
    return { id: registeredAddress.id };
  }

  async delete(ids: number[]) {
    const addresses = await this._addressRepository.find();

    for (const id of ids) {
      const registeredAddress = addresses?.find((address) => address.id === id);
      if (!registeredAddress)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
    }

    await this._addressRepository.softDelete({ id: In(ids) });
    return { ids };
  }

  async hardDelete(ids: number[]) {
    const addresses = await this._addressRepository.find();

    for (const id of ids) {
      const registeredAddress = addresses?.find((address) => address.id === id);
      if (!registeredAddress)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
    }

    await this._addressRepository.delete({ id: In(ids) });
    return { ids };
  }
}
