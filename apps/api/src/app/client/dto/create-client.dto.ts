import { ClientContract } from "@interfaces/client.contract";
import { IsNumber, IsOptional } from "class-validator";

export class CreateClientDTO implements Omit<ClientContract, "id"> {
  @IsOptional()
  @IsNumber()
  personLegalId?: number;

  @IsOptional()
  @IsNumber()
  personNaturalId?: number;
}
