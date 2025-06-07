import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CategoriesModule } from "./categories/categories.module";
import s3FilesConfig from "./common/config/s3-files.config";
import databaseConfig from "./core/config/database.config";
import { DatabaseConfigContract } from "./core/contracts/database.config.contract";
import { IamModule } from "./iam/iam.module";
import { PersonModule } from "./person/person.module";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    CategoriesModule,
    IamModule,
    PersonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, s3FilesConfig],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
