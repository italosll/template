export enum CookieToken {
    AccessToken = "accessToken",
    RefreshToken = "refreshToken"
}

export interface CookieTokensContract{
    [CookieToken.AccessToken]: string,
    [CookieToken.RefreshToken]: string
}
