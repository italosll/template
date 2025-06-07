import { CookieToken } from "@interfaces/cookie-tokens.contract";
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AuthenticationService } from "./authentication.service";
import { Auth } from "./decorators/auth.decorator";
import { SignInDTO } from "./dto/sign-in.dto";
import { SignUpDTO } from "./dto/sign-up.dto";
import { AuthType } from "./enums/auth-type.enum";

@Auth(AuthType.None)
@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly _authenticationService: AuthenticationService) {}

  @Post("sign-up")
  signUp(@Body() SignUpDTO: SignUpDTO) {
    return this._authenticationService.signUp(SignUpDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post("sign-in")
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() SignInDTO: SignInDTO
  ) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpDate,
      refreshTokenExpDate,
    } = await this._authenticationService.signIn(SignInDTO);

    response
      .cookie(CookieToken.AccessToken, accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: true,
        expires: accessTokenExpDate,
      })
      .cookie(CookieToken.RefreshToken, refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: true,
        expires: refreshTokenExpDate,
      })
      .json();
  }

  @HttpCode(HttpStatus.OK)
  @Post("sign-out")
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(CookieToken.AccessToken);
    response.clearCookie(CookieToken.RefreshToken);

    return { message: "Deslogado com sucesso!" };
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('refresh-tokens')
  // refreshTokens(@Body() refreshTokenDto:RefreshTokenDto){
  //   return this._authenticationService.refreshTokens(refreshTokenDto);
  // }
}
