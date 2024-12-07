import { registerAs } from "@nestjs/config";
import { EncriptionConfigContract } from "../contracts/encription.config.contract";

export default registerAs('encryption', ()=>{

  return{
    algorithm: process.env.ENCRYPTION_ALGORITHM,
    keyHex: process.env.ENCRYPTION_ALGORITHM,
  } as EncriptionConfigContract
})
