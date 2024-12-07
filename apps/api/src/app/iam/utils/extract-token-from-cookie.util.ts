import { Request } from "express";

export function extractRefreshTokenFromCookie(request: Request): string | undefined{
  const refreshToken = request?.cookies?.["refreshToken"] as string;

  return refreshToken;
}

export function extractAccessTokenFromCookie(request: Request): string | undefined{
  const accessToken = request?.cookies?.["accessToken"] as string;

  return accessToken;
}
