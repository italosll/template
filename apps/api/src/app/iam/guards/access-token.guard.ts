import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtConfigContract } from "../contracts/jwt.config.contract";
import { REQUEST_USER_KEY } from "../iam.constants";

@Injectable()
export class AccesTokenGuard implements CanActivate{

  constructor(
    private readonly _jwtService:JwtService,
    private readonly _configService:ConfigService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractAccessTokenFromCookie(request);

    if(!token){
      throw new UnauthorizedException("undefined token");
    }
    try{
      const payload = await this._jwtService.verifyAsync(token, this._configService.get<JwtConfigContract>("jwt"))
      request[REQUEST_USER_KEY] = payload;

    }catch{
      throw new UnauthorizedException("invalid token");
    }

    return true;
  }

  private extractAccessTokenFromCookie(request: Request): string | undefined{
    const accessToken = request?.cookies?.["accessToken"] as string;

    return accessToken;
  }
}
