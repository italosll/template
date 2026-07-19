import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import redisConfig from "../config/redis.config";
import { CacheService } from "./cache.service";
import { RedisCacheService } from "./redis-cache.service";

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [{ provide: CacheService, useClass: RedisCacheService }],
  exports: [CacheService],
})
export class CacheModule {}
