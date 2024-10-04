import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class EncryptionService{
  abstract encrypt: (text: string) => string;
  abstract decrypt: (text:string) => string;
}
