import { PersonNaturalContract } from "@interfaces/person.contract";
import { IsNumber } from "class-validator";
import { CreatePersonNaturalDTO } from "./create-person-natural.dto";

export class UpdatePersonNaturalDTO
  extends CreatePersonNaturalDTO
  implements PersonNaturalContract
{
  @IsNumber()
  id!: number;
}
