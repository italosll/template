import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../authentication/authentication.service";
import {
  extractAccessTokenFromCookie,
  extractRefreshTokenFromCookie,
} from "../utils/extract-token-from-cookie.util";

@Injectable()
export class RefreshTokensMiddleware implements NestMiddleware {
  constructor(private readonly _authenticacaoService: AuthenticationService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessTokenRequest = extractAccessTokenFromCookie(req);
    const refreshTokenRequest = extractRefreshTokenFromCookie(req);

    if (!accessTokenRequest && !!refreshTokenRequest) {
      const {
        accessToken,
        accessTokenExpDate,
        refreshToken,
        refreshTokenExpDate,
      } = await this._authenticacaoService.refreshTokens({
        refreshToken: refreshTokenRequest,
      });

      req.cookies = {
        accessToken,
        refreshToken,
      };

      res
        .cookie("accessToken", accessToken, {
          secure: true,
          httpOnly: true,
          sameSite: true,
          expires: accessTokenExpDate,
        })
        .cookie("refreshToken", refreshToken, {
          secure: true,
          httpOnly: true,
          sameSite: true,
          expires: refreshTokenExpDate,
        });
    }
    next();
  }
}
