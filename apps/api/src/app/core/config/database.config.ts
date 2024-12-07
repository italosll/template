import { registerAs } from "@nestjs/config";
import { DatabaseConfigContract } from "../contracts/database.config.contract";

export default registerAs('database', ()=>{

  return{
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE
  } as DatabaseConfigContract
})
