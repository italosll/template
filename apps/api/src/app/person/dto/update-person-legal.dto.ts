import { PersonLegalContract } from "@interfaces/person.contract";
import { IsNumber } from "class-validator";
import { CreatePersonLegalDTO } from "./create-person.legal";

export class UpdatePersonLegalDTO
  extends CreatePersonLegalDTO
  implements PersonLegalContract
{
  @IsNumber()
  id!: number;
}
