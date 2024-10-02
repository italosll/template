import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { HTTP_ERROR_MESSAGES } from "../common/utils/HttpErrorMessages.util";
import { getQuerys } from "./utils/GetQuery.util";
import { AuditContract } from "../common/contracts/Audit.contract";
import { UserContract } from "@template/interfaces";
import { UsersServiceContract } from "./contracts/users.service.contract";
import { HashService } from "../common/services/hash.service";
import { EncryptionService } from "../common/services/encryption.service";

@Injectable()
export class UsersService implements UsersServiceContract {

  constructor(
    @InjectRepository(User) private _userRepository:Repository<User>,
    private _hashService: HashService,
    private _encryptionService: EncryptionService
  ){}

  async findAll(user?:UserContract & AuditContract): Promise<User[]>{
    const querys = getQuerys(user);
    const queryBuilder = this._userRepository.createQueryBuilder();

    if(user?.filterableEmail) queryBuilder.andWhere(querys.filterableEmail.where,querys.filterableEmail.parameters);
    if(user?.id) queryBuilder.andWhere(querys.id.where, querys.id.parameters);

    if(user?.createdAt) queryBuilder.andWhere(querys.createdAt.where, querys.createdAt.parameters);
    if(user?.updatedAt) queryBuilder.andWhere(querys.updatedAt.where, querys.updatedAt.parameters);
    if(user?.deletedAt) queryBuilder.andWhere(querys.deletedAt.where, querys.deletedAt.parameters);
    if(user?.recoveredAt) queryBuilder.andWhere(querys.recoveredAt.where, querys.recoveredAt.parameters);

    const encryptedUsers = await queryBuilder.getMany();
    const decryptedUsers = User.decrypt(encryptedUsers, this._encryptionService);

    return decryptedUsers;
  }

  async create(createEntity:CreateUserDTO): Promise<CreateDefaultResponseDTO>{

    const encryptedUsers = await this._userRepository.find();
    const decryptedUsers = User.decrypt(encryptedUsers, this._encryptionService);

    const registeredUser = decryptedUsers?.find(({email})=> email === createEntity.email);
    if(registeredUser) throw new HttpException(HTTP_ERROR_MESSAGES.alreadyExists(), HttpStatus.CONFLICT);

    const hashedPassword = await this._hashService.generate(createEntity.password);
    createEntity.password = hashedPassword;

    const entity = User.encrypt(createEntity, this._encryptionService);

  	const created = await this._userRepository.save(entity);

    const response = { id: created.id };
    return response;
  }

  async update(updateEntity?:UpdateUserDTO): Promise<UpdateDefaultResponseDTO>{

    const encryptedUsers = await this._userRepository.find({
      select:["createdAt","deletedAt","email","filterableEmail","id","recoveredAt","updatedAt","password"]
    });

    const decryptedUsers = User.decrypt(encryptedUsers, this._encryptionService);

    let registeredUser = decryptedUsers?.find(({id})=> id === updateEntity.id);

    if(!registeredUser) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);

    if(updateEntity.password){
      updateEntity.password = await this._hashService.generate(updateEntity.password);
    }

    registeredUser = User.encrypt(registeredUser, this._encryptionService);

    const merged = this._userRepository.merge(registeredUser, updateEntity);

    await this._userRepository.save(merged);
    const response = { id: registeredUser.id };

    return response;
  }

  async delete(id:number) {
    const users = await this._userRepository.find();
    const registeredUser = users?.find((user)=> user.id === id);

    if(!registeredUser) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);

    await this._userRepository.softDelete(id);

    return { id };
  }

  async hardDelete(id:number) {
    const users = await this._userRepository.find();
    const registeredUser = users?.find((user)=> user.id === id);

    if(!registeredUser) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);

    await this._userRepository.delete(id);
    return { id };
  }
}
