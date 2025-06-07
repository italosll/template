import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class S3FilesService {
  abstract upload(
    path: string[],
    fileBase64?: string | undefined | null,
    key?: string
  ): Promise<string>;
  abstract getUrlByKey(key: string): string;
  abstract getFileInfoByS3FileKey(
    s3FileKey: string | null | undefined,
    description: string
  ): {
    url: string;
    name: string;
  };
}
