import { UserContract } from "@interfaces/user.contract";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { AuditContract } from "../common/contracts/audit.contract";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { EncryptionService } from "../common/encryption/encryption.service";
import { EntityService } from "../common/services/entity.service";
import { HTTP_ERROR_MESSAGES } from "../common/utils/http-error-messages.util";
import { HashingService } from "../iam/hashing/hashing.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { responseUserDTO } from "./dto/response-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserFactory } from "./factories/user.factory";

@Injectable()
export class UsersService
  implements EntityService<responseUserDTO, CreateUserDTO, UpdateUserDTO>
{
  constructor(
    @InjectRepository(User) private _userRepository: Repository<User>,
    private _hasingService: HashingService,
    private _encryptionService: EncryptionService
  ) {}

  async findAll(
    user?: Partial<UserContract & AuditContract>
  ): Promise<responseUserDTO[]> {
    const queryBuilder = this._userRepository.createQueryBuilder();

    const encryptedUsers = await queryBuilder.getMany();
    const decryptedUsers = User.decrypt(
      encryptedUsers,
      this._encryptionService
    );

    const userFactory = new UserFactory();
    const users = decryptedUsers.map((du) => userFactory.response(du));
    return users;
  }

  async create(createEntity: CreateUserDTO): Promise<CreateDefaultResponseDTO> {
    const encryptedUsers = await this._userRepository.find();
    const decryptedUsers = User.decrypt(
      encryptedUsers,
      this._encryptionService
    );

    const registeredUser = decryptedUsers?.find(
      ({ email }) => email === createEntity.email
    );
    if (registeredUser)
      throw new HttpException(
        HTTP_ERROR_MESSAGES.alreadyExists(),
        HttpStatus.CONFLICT
      );

    const hashedPassword = await this._hasingService.generate(
      createEntity.password
    );
    createEntity.password = hashedPassword;

    const entity = User.encrypt(createEntity, this._encryptionService);
    const created = await this._userRepository.save(entity);

    console.log("------");
    console.log(encryptedUsers);
    console.log(decryptedUsers);
    console.log(created);
    console.log(entity);

    const response = { id: created.id };
    return response;
  }

  async update(
    updateEntity?: UpdateUserDTO
  ): Promise<UpdateDefaultResponseDTO> {
    const encryptedUsers = await this._userRepository.find({
      select: [
        "createdAt",
        "deletedAt",
        "email",
        "filterableEmail",
        "id",
        "recoveredAt",
        "updatedAt",
        "password",
      ],
    });

    const decryptedUsers = User.decrypt(
      encryptedUsers,
      this._encryptionService
    );

    let registeredUser = decryptedUsers?.find(
      ({ id }) => id === updateEntity?.id
    );

    if (!registeredUser)
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );

    if (updateEntity?.password) {
      updateEntity.password = await this._hasingService.generate(
        updateEntity.password
      );
    }

    registeredUser = User.encrypt(registeredUser, this._encryptionService);

    const merged = this._userRepository.merge(
      registeredUser,
      updateEntity ?? {}
    );

    await this._userRepository.save(merged);
    const response = { id: registeredUser.id };

    return response;
  }

  async delete(ids: number[]) {
    const users = await this._userRepository.find();

    ids.forEach((id) => {
      const registeredUser = users?.find((user) => user.id === id);
      if (!registeredUser)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
    });

    await this._userRepository.softDelete({ id: In(ids) });

    return { ids };
  }

  async hardDelete(ids: number[]) {
    const users = await this._userRepository.find();

    ids.forEach((id) => {
      const registeredUser = users?.find((user) => user.id === id);
      if (!registeredUser)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
    });

    await this._userRepository.delete({ id: In(ids) });

    return { ids };
  }
}
