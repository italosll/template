import { AddressContract } from "@interfaces/address.contract";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAddressDTO implements Omit<AddressContract, "id"> {
  @IsNotEmpty()
  @IsString()
  streetAddress!: string;

  @IsNotEmpty()
  @IsString()
  neighborhood!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @IsString()
  postalCode!: string;

  @IsNotEmpty()
  @IsString()
  country!: string;

  @IsNotEmpty()
  @IsNumber()
  personId!: number;
}
