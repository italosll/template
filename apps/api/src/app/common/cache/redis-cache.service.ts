import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { RedisConfigContract } from "../contracts/redis.config.contract";
import { CacheService } from "./cache.service";

@Injectable()
export class RedisCacheService
  extends CacheService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly _logger = new Logger(RedisCacheService.name);
  private _client!: Redis;

  constructor(private readonly _configService: ConfigService) {
    super();
  }

  async onModuleInit(): Promise<void> {
    const config = this._configService.get<RedisConfigContract>("redis");

    this._client = new Redis({
      host: config?.host ?? "localhost",
      port: config?.port ?? 6379,
      password: config?.password,
      db: config?.db ?? 0,
      keyPrefix: config?.keyPrefix || undefined,
      maxRetriesPerRequest: 3,
    });

    this._client.on("error", (error) => {
      this._logger.error(`Redis error: ${error.message}`, error.stack);
    });

    this._client.on("connect", () => {
      this._logger.log("Redis cache connected");
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this._client) {
      await this._client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    return this._client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds && ttlSeconds > 0) {
      await this._client.set(key, value, "EX", ttlSeconds);
      return;
    }
    await this._client.set(key, value);
  }

  async delete(key: string): Promise<void> {
    await this._client.del(key);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const prefix = (this._client.options.keyPrefix as string) || "";
    let cursor = "0";

    do {
      const [nextCursor, keys] = await this._client.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        // SCAN returns keys with the prefix already applied; strip it before DEL
        // so ioredis does not double-prefix.
        const unprefixed = keys.map((key) =>
          prefix && key.startsWith(prefix) ? key.slice(prefix.length) : key
        );
        await this._client.del(...unprefixed);
      }
    } while (cursor !== "0");
  }

  async exists(key: string): Promise<boolean> {
    const result = await this._client.exists(key);
    return result === 1;
  }

  async getSetMembers(key: string): Promise<string[]> {
    const members = await this._client.smembers(key);
    return members.filter((member) => member !== "__empty__");
  }

  async addToSet(
    key: string,
    members: string[],
    ttlSeconds?: number
  ): Promise<void> {
    await this._client.del(key);

    // Redis cannot store an empty set; use a sentinel so cache hits still work.
    const values = members.length > 0 ? members : ["__empty__"];
    await this._client.sadd(key, ...values);

    if (ttlSeconds && ttlSeconds > 0) {
      await this._client.expire(key, ttlSeconds);
    }
  }

  async isSetMember(key: string, member: string): Promise<boolean> {
    const result = await this._client.sismember(key, member);
    return result === 1;
  }

  async deleteSet(key: string): Promise<void> {
    await this._client.del(key);
  }
}
