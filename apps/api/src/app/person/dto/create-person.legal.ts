import { PersonLegalContract } from "@interfaces/person.contract";
import { IsString } from "class-validator";

export class CreatePersonLegalDTO implements Omit<PersonLegalContract, "id"> {
  @IsString()
  name!: string;

  @IsString()
  email!: string;

  @IsString()
  phoneNumber!: string;

  @IsString()
  document!: string;

  @IsString()
  companyRealName!: string;
}
