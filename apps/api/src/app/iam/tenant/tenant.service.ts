import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SignUpDTO } from "../dto/sign-up.dto";
import { MYSQL_VIOLATION_ERROR_CODES } from "@api/common/utils/mysql-violation-error-codes";
import { ConflictException } from "@nestjs/common";
import { PersonLegal } from "@api/person/entities/person-legal.entity";
import { UsersService } from "@api/users/users.service";
import { Tenant } from "../entities/tenant.entity";

export class TenantService {
  constructor(
    @InjectRepository(Tenant) private readonly _usersRepository: Repository<Tenant>,
    @InjectRepository(Tenant) private readonly _tenantRepository: Repository<Tenant>,
    @InjectRepository(PersonLegal) private readonly _personLegalRepository: Repository<PersonLegal>,
    private readonly _usersService: UsersService,
  ) {
  }

  async getAlltenants(): Promise<Tenant[]> {
    return await this._tenantRepository.find();
  }

  async signUp(signUpDTO: SignUpDTO): Promise<{ id: number }> {
    try {
      const tenant = new Tenant();
      await this._tenantRepository.save(tenant);

      const legalPerson = new PersonLegal();
      legalPerson.companyRealName = signUpDTO.companyRealName;
      legalPerson.tenantId = tenant.id;
      await this._personLegalRepository.save(legalPerson);

      tenant.personLegalId = legalPerson.id;
      await this._tenantRepository.save(tenant);

      const user = await this._usersService.create({
        email: signUpDTO.email,
        password: signUpDTO.password,
        tenantId: tenant.id,
      })

      return { id: user.id };
    } catch (err) {
      const mysqlUniqueValidationErrorCode = MYSQL_VIOLATION_ERROR_CODES.unique;

      if (
        (err as Error & { code: number })?.code ===
        mysqlUniqueValidationErrorCode
      ) {
        throw new ConflictException();
      }
      throw err;
    }
  }
}
