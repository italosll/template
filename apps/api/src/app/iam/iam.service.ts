import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";
import { CompaniesService } from "../company/companies.service";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { HTTP_ERROR_MESSAGES } from "../common/utils/http-error-messages.util";
import { User } from "../users/entities/user.entity";
import { Tenant } from "./entities/tenant.entity";
import { Repository } from "typeorm";

@Injectable()
export class IamService{

  constructor(
    @InjectRepository(Tenant) private _tenantRepository: Repository<Tenant>,
    @Inject(UsersService) private _usersService: UsersService,
    @Inject(CompaniesService) private _companiesService: CompaniesService
  ){}

  async createAccount(createEntity:CreateAccountDTO): Promise<CreateDefaultResponseDTO>{


    const tenant = await this._tenantRepository.save({});

    const user = await this._usersService.create({...createEntity, tenantId: tenant.id});


    // const registeredUser = await this._usersService.findAll({email: createEntity.email});
    // const registeredCompany = await this._companiesService.findAll({cnpj: createEntity.cnpj});

    // if(registeredCompany || registeredUser) throw new HttpException(HTTP_ERROR_MESSAGES.alreadyExists(), HttpStatus.CONFLICT);


  	// const entity = this._categoryRepository.create(createEntity);
  	// const created = await this._categoryRepository.save(entity);
    // const response = { id: created.id };
    // return response;
  }
 
}
