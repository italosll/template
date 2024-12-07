import { registerAs } from "@nestjs/config";
import { HashConfigContract } from "../contracts/hash.config.contract";

export default registerAs('hash', ()=>{

  return{
    hashRounds: parseInt(process.env.HASH_ROUNDS, 10),
  } as HashConfigContract
})
