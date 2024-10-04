import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory: (configService:ConfigService) => ({
        type: "mysql",
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DATABASE'),
        entities: [],
        synchronize: true, // precisa ser desabilitado em produção
        autoLoadEntities: true
      })
    })

    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: "localhost",
    //   port: 3306,
    //   username: "root",
    //   password: "template",
    //   database: "template",
    //   entities: [],
    //   synchronize: true, // precisa ser desabilitado em produção
    //   autoLoadEntities: true
    // })


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
