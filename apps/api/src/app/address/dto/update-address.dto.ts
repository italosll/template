import { AddressContract } from "@interfaces/address.contract";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateAddressDTO } from "./create-address.dto";

export class UpdateAddressDTO
  extends CreateAddressDTO
  implements AddressContract
{
  @IsNotEmpty()
  @IsNumber()
  id!: number;
}
