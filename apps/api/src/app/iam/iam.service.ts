import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { HTTP_ERROR_MESSAGES } from "../common/utils/http-error-messages.util";
import { CompaniesService } from "../company/companies.service";
import { UsersService } from "../users/users.service";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { Tenant } from "./entities/tenant.entity";

@Injectable()
export class IamService {
  constructor(
    @InjectRepository(Tenant) private _tenantRepository: Repository<Tenant>,
    @Inject(UsersService) private _usersService: UsersService,
    @Inject(CompaniesService) private _companiesService: CompaniesService
  ) {}

  async createAccount(
    createEntity: CreateAccountDTO
  ): Promise<CreateDefaultResponseDTO> {
    const registeredUser = await this._usersService.findAll({
      email: createEntity.email,
    });
    const registeredCompany = await this._companiesService.findAll({
      cnpj: createEntity.cnpj,
    });

    if (registeredCompany || registeredUser)
      throw new HttpException(
        HTTP_ERROR_MESSAGES.alreadyExists(),
        HttpStatus.CONFLICT
      );

    const tenant = await this._tenantRepository.save({});
    const user = await this._usersService.create({
      ...createEntity,
      tenantId: tenant.id,
    });
    const company = await this._companiesService.create({
      ...createEntity,
      tenantId: tenant.id,
    });

    this._tenantRepository.save({ ...tenant, company });

    const entity = this._categoryRepository.create(createEntity);
    const created = await this._categoryRepository.save(entity);
    const response = { id: created.id };
    return response;
  }
}
