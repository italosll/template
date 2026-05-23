import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateClientDTO } from "./create-client.dto";

export class UpdateClientDTO extends CreateClientDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;
}
