import { PersonNaturalContract } from "@interfaces/person.contract";
import { IsDateString, isDateString, IsString } from "class-validator";

export class CreatePersonNaturalDTO
  implements Omit<PersonNaturalContract, "id">
{
  @IsString()
  name!: string;

  @IsString()
  email!: string;

  @IsString()
  phoneNumber!: string;

  @IsString()
  document!: string;

  @IsDateString()
  birthDate!: string;
}
