import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EncryptionService } from "@api/common/encryption/encryption.service";
import { CryptoService } from "@api/common/encryption/crypto.service";
import { AuthorizationModule } from "@api/iam/authorization/authorization.module";
import { AuditLog } from "./entities/audit-log.entity";
import { AuditService } from "./audit.service";
import { AuditController } from "./audit.controller";
import { AuditInterceptor } from "./audit.interceptor";

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog]), AuthorizationModule],
  controllers: [AuditController],
  providers: [
    AuditService,
    { provide: EncryptionService, useClass: CryptoService },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
  exports: [AuditService],
})
export class AuditModule {}
