import { ClientContract } from "@interfaces/client.contract";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateClientDTO } from "./create-client.dto";

export class UpdateClientDTO
  extends CreateClientDTO
  implements ClientContract
{
  @IsNotEmpty()
  @IsNumber()
  id!: number;
}
