import { CreatePersonLegalDTO } from "@api/person/dto/create-person.legal";
import { IntersectionType, OmitType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "../../users/dto/create-user.dto";
import { CreateTenantDTO } from "./create-tenant.dto";

class CreateUserWithoutTenantDTO extends OmitType(CreateUserDTO, ["tenantId"] as const) {}

export class SignUpDTO extends IntersectionType(
  CreateUserWithoutTenantDTO,
  CreatePersonLegalDTO,
  CreateTenantDTO
) {}
