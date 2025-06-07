import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { EncryptionService } from "./encryption.service";

@Injectable()
export class CryptoService implements EncryptionService {
  constructor(private _configService: ConfigService) {}

  private _algorithm = this._configService.get<string>("ENCRYPTION_ALGORITHM");
  private _keyHex = this._configService.get<string>("ENCRYPTION_KEYHEX");

  public encrypt(text: string) {
    if (!this._algorithm || !this._keyHex) {
      throw new Error("Encryption algorithm or key is not configured.");
    }
    const initializationVector = randomBytes(16);

    const cipher = createCipheriv(
      this._algorithm,
      Buffer.from(this._keyHex, "hex"),
      initializationVector
    );

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return `${initializationVector.toString("hex")}|${encrypted.toString(
      "hex"
    )}`;
  }

  public decrypt(text: string) {
    const initializationVector = Buffer.from(
      text.split("|")?.at(0) ?? "",
      "hex"
    );
    const encriptedText = Buffer.from(text.split("|")?.at(1) ?? "", "hex");

    if (!this._algorithm || !this._keyHex) {
      throw new Error("Encryption algorithm or key is not configured.");
    }
    const decipher = createDecipheriv(
      this._algorithm,
      Buffer.from(this._keyHex, "hex"),
      initializationVector
    );

    const decrypted = Buffer.concat([
      decipher.update(encriptedText),
      decipher.final(),
    ]);

    return decrypted.toString();
  }
}
