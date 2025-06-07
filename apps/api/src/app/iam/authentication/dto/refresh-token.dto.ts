import { CookieTokensContract } from "@interfaces/cookie-tokens.contract";
import { IsNotEmpty } from "class-validator";

export class RefreshTokenDto implements Partial<CookieTokensContract> {
  @IsNotEmpty()
  refreshToken!: string;
}
