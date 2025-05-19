import { IntersectionType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "../../users/dto/create-user.dto";
import { CreateCompanyDTO } from "../../company/dto/create-companies.dto";

export class CreateAccountDTO extends IntersectionType(
  CreateUserDTO,
  CreateCompanyDTO
) {}
