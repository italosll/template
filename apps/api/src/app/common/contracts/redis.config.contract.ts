export interface RedisConfigContract {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
}
