export interface ActiveUserContract{
  sub:number,
  email:string,
  tenantId:number,
  iat:number,
  exp:number,
  aud:string,
  iss:string
}
