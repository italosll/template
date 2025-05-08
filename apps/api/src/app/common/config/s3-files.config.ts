import { registerAs } from "@nestjs/config";
import { S3FilesConfigContract } from "../contracts/s3-files.config.contract";

export default registerAs('s3-files', ()=>{

  return{
    s3Endpoint: process.env.S3_ENDPOINT,
    s3Region: process.env.S3_REGION,
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    s3Bucket: process.env.S3_BUCKET_NAME,
    s3PublicBucketEndpoint: process.env.S3_PUBLIC_BUCKET_ENDPOINT
  } as S3FilesConfigContract
})
