import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

@Injectable()
export class EncryptionService{

  constructor(private _configService: ConfigService){}

  private _algorithm = this._configService.get<string>('ENCRYPTION_ALGORITHM');
  private _keyHex = this._configService.get<string>('ENCRYPTION_KEYHEX');

  public encrypt(text:string) {
    const initializationVector = randomBytes(16);

    const cipher = createCipheriv(this._algorithm,Buffer.from(this._keyHex,"hex"), initializationVector);

    const encrypted = Buffer.concat([
      cipher.update(text),
      cipher.final()
    ]);

    return `${initializationVector.toString("hex")}|${encrypted.toString("hex")}` ;
  }

  public decrypt(text:string){

    const initializationVector = Buffer.from(text.split("|")?.at(0),"hex");
    const encriptedText = Buffer.from(text.split("|")?.at(1), "hex");

    const decipher = createDecipheriv(this._algorithm, Buffer.from(this._keyHex,"hex"), initializationVector);

    const decrypted = Buffer.concat([
      decipher.update(encriptedText),
      decipher.final()
    ]);

    return decrypted.toString();
  }
}
