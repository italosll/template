import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CryptoService } from "../common/encryption/crypto.service";
import { EncryptionService } from "../common/encryption/encryption.service";
import { User } from "../users/entities/user.entity";
import { AuthenticationController } from "./authentication/authentication.controller";
import { AuthenticationService } from "./authentication/authentication.service";
import jwtConfig from "./config/jwt.config";
import { Tenant } from "./entities/tenant.entity";
import { AccesTokenGuard } from "./guards/access-token.guard";
import { AuthenticationGuard } from "./guards/authentication.guard";
import { BcryptService } from "./hashing/bcrypt.service";
import { HashingService } from "./hashing/hashing.service";
import { RefreshTokensMiddleware } from "./middlewares/refresh-tokens.middleware";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    { provide: EncryptionService, useClass: CryptoService },
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    AuthenticationService,
    AccesTokenGuard,
  ],
  controllers: [AuthenticationController],
})
export class IamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RefreshTokensMiddleware)
      .exclude({ path: "authentication", method: RequestMethod.ALL })
      .forRoutes({
        path: "*",
        method: RequestMethod.ALL,
      });
  }
}
