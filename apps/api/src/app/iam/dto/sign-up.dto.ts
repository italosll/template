import { CreatePersonLegalDTO } from "@api/person/dto/create-person.legal";
import { IntersectionType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "../../users/dto/create-user.dto";
import { CreateTenantDTO } from "./create-tenant.dto";

export class SignUpDTO extends IntersectionType(
  CreateUserDTO,
  CreatePersonLegalDTO,
  CreateTenantDTO
) {}
