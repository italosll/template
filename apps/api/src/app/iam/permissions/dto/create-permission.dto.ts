import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(\.[a-z0-9]+)+$/, {
    message:
      "Permission code must use dotted format, e.g. product.create",
  })
  code!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
