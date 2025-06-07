import { HTTP_ERROR_MESSAGES } from "@api/common/utils/http-error-messages.util";
import { PersonLegal } from "@api/person/entities/person-legal.entity";
import { Person } from "@api/person/entities/person.entity";
import { User } from "@api/users/entities/user.entity";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, EntityManager, Repository } from "typeorm";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { S3FilesService } from "../common/files/s3-files.service";
import { SignUpDTO } from "./dto/sign-up.dto";
import { Tenant } from "./entities/tenant.entity";

@Injectable()
export class IamService {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource,
    @Inject(S3FilesService) private _filesService: S3FilesService
  ) {}

  private async _getRegisteredUser(
    userRepository: Repository<User>,
    createEntity: SignUpDTO
  ): Promise<User | null> {
    const userByPhoneNumber = await userRepository.findOne({
      where: { phoneNumber: createEntity.phoneNumber },
    });

    const userByEmail = await userRepository.findOne({
      where: { email: createEntity.email },
    });

    const registeredUser = userByEmail ?? userByPhoneNumber;
    return registeredUser;
  }

  private async _ensureNoDuplicates(
    manager: EntityManager,
    createEntity: SignUpDTO
  ): Promise<void> {
    const userRepository = manager.getRepository(User);
    const personRepository = manager.getRepository(Person);

    const [registeredUser, registeredPerson] = await Promise.all([
      this._getRegisteredUser(userRepository, createEntity),
      personRepository.findOne({
        where: { document: createEntity.document },
      }),
    ]);

    if (registeredUser || registeredPerson) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.alreadyExists(),
        HttpStatus.CONFLICT
      );
    }
  }

  private async _createTenant(
    manager: EntityManager,
    createEntity?: SignUpDTO
  ) {
    const tenantRepository = manager.getRepository(Tenant);
    const tenantEntity = new Tenant();
    const createdTenant = await tenantRepository.save(tenantEntity);

    if (createEntity?.image) {
      const s3FileKey = this._filesService.upload([
        String(createdTenant.id),
        "profile",
      ]);

      await tenantRepository.save({
        ...createdTenant,
        image: s3FileKey,
      });
    }

    return createdTenant;
  }

  private async _createUser(
    manager: EntityManager,
    createEntity: SignUpDTO & { tenantId: number }
  ) {
    const userRepository = manager.getRepository(User);

    return await userRepository.save({
      ...createEntity,
    });
  }

  private async _createPerson(
    manager: EntityManager,
    createEntity: SignUpDTO & { tenantId: number }
  ) {
    const personRepository = manager.getRepository(Person);
    return await personRepository.save({
      ...createEntity,
      tenantId: createEntity.tenantId,
    });
  }

  private async _createPersonLegal(
    manager: EntityManager,
    createEntity: SignUpDTO & { personId: number; tenantId: number }
  ) {
    const personLegalRepository = manager.getRepository(PersonLegal);
    return await personLegalRepository.save({
      ...createEntity,
      personId: createEntity.personId,
      tenantId: createEntity.tenantId,
    });
  }

  async signUp(createEntity: SignUpDTO): Promise<CreateDefaultResponseDTO> {
    return this.datasource.transaction(async (manager) => {
      await this._ensureNoDuplicates(manager, createEntity);

      const createdTenant = await this._createTenant(manager);

      const createdUser = await this._createUser(manager, {
        ...createEntity,
        tenantId: createdTenant.id,
      });

      const createdPerson = await this._createPerson(manager, {
        ...createEntity,
        tenantId: createdTenant.id,
      });

      await this._createPersonLegal(manager, {
        ...createEntity,
        personId: createdPerson.id,
        tenantId: createdTenant.id,
      });

      return { id: createdUser.id };
    });
  }
}
