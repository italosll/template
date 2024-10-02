import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService{

  constructor(private _configService: ConfigService){}

  public async  generate(text:string){
    const rounds = Number(this._configService.get("HASH_ROUNDS"))
    const hash = await bcrypt.hash(text, rounds);

    return hash;
  }

  public async isMatch(text:string, hash:string){
    return await bcrypt.compare(text,hash);
  }
}
