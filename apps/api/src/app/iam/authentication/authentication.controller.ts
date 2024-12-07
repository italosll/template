import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { SignUpDTO } from "./dto/sign-up.dto";
import { SignInDTO } from "./dto/sign-in.dto";
import { Response } from "express"
import { Auth } from "./decorators/auth.decorator";
import { AuthType } from "./enums/auth-type.enum";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController{

  constructor(private readonly _authenticationService:AuthenticationService){}

  @Post('sign-up')
  signUp(@Body() SignUpDTO:SignUpDTO){
    return this._authenticationService.signUp(SignUpDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() SignInDTO:SignInDTO
  ){
    const {
      accessToken,
      refreshToken,
      accessTokenExpDate,
      refreshTokenExpDate
    } = (await this._authenticationService.signIn(SignInDTO));

    response
    .cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
      expires: accessTokenExpDate
    })
    .cookie('refreshToken', refreshToken, {
      secure:true,
      httpOnly:true,
      sameSite:true,
      expires: refreshTokenExpDate
    })
    .json()
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('refresh-tokens')
  // refreshTokens(@Body() refreshTokenDto:RefreshTokenDto){
  //   return this._authenticationService.refreshTokens(refreshTokenDto);
  // }
}
