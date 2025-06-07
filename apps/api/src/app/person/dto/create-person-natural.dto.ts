import { PersonNaturalContract } from "@interfaces/person.contract";
import { IsString } from "class-validator";

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

  @IsString()
  birthDate!: Date;
}
