import { CreatePersonLegalDTO } from "@api/person/dto/create-person.legal";
import { CreatePersonNaturalDTO } from "@api/person/dto/create-person-natural.dto";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

export class CreateClientDTO {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonLegalDTO)
  personLegal?: CreatePersonLegalDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonNaturalDTO)
  personNatural?: CreatePersonNaturalDTO;
}
