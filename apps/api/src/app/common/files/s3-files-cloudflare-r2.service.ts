import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3FilesConfigContract } from "../contracts/s3-files.config.contract";
import { generateUniqueId } from "../utils/generate-unique-ids.util";

@Injectable()
export class S3FilesCloudflareR2Service {
  private _s3Config: S3FilesConfigContract;
  private _s3Client: S3Client;

  constructor(@Inject() private readonly _configService: ConfigService) {
    this._s3Config = this._configService.get<S3FilesConfigContract>("s3-files");
    this._s3Client = new S3Client({
      region: this._s3Config.s3Region,
      endpoint: this._s3Config.s3Endpoint,
      credentials: {
        accessKeyId: this._s3Config.s3AccessKeyId,
        secretAccessKey: this._s3Config.s3SecretAccessKey,
      },
    });
  }

  private _decodeBase64StringToBuffer(base64String: string) {
    const contentType = base64String?.split(";")[0].split(":")[1];
    const content = Buffer.from(base64String.split(",")[1], "base64");

    return {
      contentType,
      content,
    };
  }

  private generateKey(path: string[], contentType: string) {
    const uniqueId = generateUniqueId();
    let key = path.join("/");
    if (path.length > 0) key += "/";
    key += uniqueId + "." + contentType.split("/")[1];
    return key;
  }

  public async upload(path: string[], fileBase64?: string, key?: string) {
    if (!fileBase64) return;
    const { content, contentType } =
      this._decodeBase64StringToBuffer(fileBase64);

    const command = new PutObjectCommand({
      Bucket: this._s3Config.s3Bucket,
      Key: key ?? this.generateKey(path, contentType),
      Body: content,
      ContentType: contentType,
    });

    return await this._s3Client.send(command).then(() => command.input.Key);
  }

  public getUrlByKey(key: string) {
    const url = `${this._s3Config.s3PublicBucketEndpoint}/${key}`;
    return url;
  }

  public getFileInfoByS3FileKey(s3FileKey: string, description: string) {
    if (!s3FileKey) return null;

    const extension = s3FileKey.split(".").pop();
    return {
      url: this.getUrlByKey(s3FileKey),
      name: ` ${description}.${extension}`,
    };
  }
}
