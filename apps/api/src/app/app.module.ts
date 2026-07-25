import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CategoriesModule } from "./categories/categories.module";
import { AddressModule } from "./address/address.module";
import s3FilesConfig from "./common/config/s3-files.config";
import redisConfig from "./common/config/redis.config";
import databaseConfig from "./core/config/database.config";
import { DatabaseConfigContract } from "./core/contracts/database.config.contract";
import { IamModule } from "./iam/iam.module";
import { RolesModule } from "./iam/roles/roles.module";
import { PermissionsModule } from "./iam/permissions/permissions.module";
import { AuthorizationModule } from "./iam/authorization/authorization.module";
import { CacheModule } from "./common/cache/cache.module";
import { PersonModule } from "./person/person.module";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module";
import { ServiceOrderModule } from "./service-order/service-order.module";
import { ClientModule } from "./client/client.module";
import { QuotationModule } from "./quotation/quotation.module";
import { AuditModule } from "./audit/audit.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, s3FilesConfig, redisConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfigContract>("database");
        return {
          type: "mysql",
          host: dbConfig?.host,
          port: dbConfig?.port,
          username: dbConfig?.username,
          password: dbConfig?.password,
          database: dbConfig?.database,
          entities: [],
          synchronize: true, // precisa ser desabilitado em produção
          autoLoadEntities: true,
        };
      },
    }),
    CacheModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    AddressModule,
    ServiceOrderModule,
    ClientModule,
    QuotationModule,
    IamModule,
    PermissionsModule,
    AuthorizationModule,
    RolesModule,
    PersonModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
