import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { IamModule } from './iam/iam.module';
import databaseConfig from './core/config/database.config';
import { DatabaseConfigContract } from './core/contracts/database.config.contract';
import { CategoriesModule } from './categories/categories.module';
import s3FilesConfig from './common/config/s3-files.config';
import { CompanyModule } from './company/companies.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    CompanyModule,
    CategoriesModule,
    IamModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load:[
        databaseConfig,
        s3FilesConfig
      ]
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService:ConfigService) => {
        const dbConfig = configService.get<DatabaseConfigContract>('database');
        return {
        type: "mysql",
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        entities: [],
        synchronize: true, // precisa ser desabilitado em produção
        autoLoadEntities: true
      }}
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
