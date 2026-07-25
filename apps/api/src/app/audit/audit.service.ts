import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EncryptionService } from "@api/common/encryption/encryption.service";
import { AuditLog } from "./entities/audit-log.entity";
import { QueryAuditDTO } from "./dto/query-audit.dto";
import {
  decryptAuditMetadata,
  sanitizeAuditMetadata,
} from "./utils/sanitize-audit-metadata.util";

export interface RecordAuditInput {
  action: string;
  userId?: number;
  tenantId?: number;
  isSuperUser: boolean;
  resourceType?: string;
  resourceId?: string;
  statusCode: number;
  executionTimeMs: number;
  /** Plaintext IP; encrypted before persistence. */
  ipAddress?: string;
  /** Raw request/response data; sanitized and selectively encrypted before persistence. */
  metadata?: Record<string, unknown>;
}

const DEFAULT_PAGE_SIZE = 50;

/**
 * Single writer of the audit trail. All LGPD handling (banned keys,
 * selective encryption, IP encryption) happens here so no other layer
 * ever persists sensitive data.
 */
@Injectable()
export class AuditService {
  private readonly _logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly _auditLogRepository: Repository<AuditLog>,
    private readonly _encryptionService: EncryptionService
  ) {}

  async record(input: RecordAuditInput): Promise<AuditLog> {
    const entity = this._auditLogRepository.create({
      action: input.action,
      userId: input.userId,
      tenantId: input.tenantId,
      isSuperUser: input.isSuperUser,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      statusCode: input.statusCode,
      executionTimeMs: input.executionTimeMs,
      ipAddress: input.ipAddress
        ? this._encryptionService.encrypt(input.ipAddress)
        : undefined,
      metadata: input.metadata
        ? (sanitizeAuditMetadata(input.metadata, (value) =>
            this._encryptionService.encrypt(value)
          ) as Record<string, unknown>)
        : undefined,
    });

    return this._auditLogRepository.save(entity);
  }

  /**
   * Lists audit entries for a tenant (required filter), newest first.
   * IP and encrypted metadata fields are decrypted for authorized readers.
   */
  async findByFilters(query: QueryAuditDTO): Promise<AuditLog[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_PAGE_SIZE;

    const qb = this._auditLogRepository
      .createQueryBuilder("audit")
      .where("audit.tenantId = :tenantId", { tenantId: query.tenantId })
      .orderBy("audit.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    if (query.userId !== undefined) {
      qb.andWhere("audit.userId = :userId", { userId: query.userId });
    }
    if (query.resourceType) {
      qb.andWhere("audit.resourceType = :resourceType", {
        resourceType: query.resourceType,
      });
    }
    if (query.resourceId) {
      qb.andWhere("audit.resourceId = :resourceId", {
        resourceId: query.resourceId,
      });
    }
    if (query.action) {
      qb.andWhere("audit.action = :action", { action: query.action });
    }
    if (query.statusCode !== undefined) {
      qb.andWhere("audit.statusCode = :statusCode", {
        statusCode: query.statusCode,
      });
    }
    if (query.from) {
      qb.andWhere("audit.createdAt >= :from", { from: new Date(query.from) });
    }
    if (query.to) {
      qb.andWhere("audit.createdAt <= :to", { to: new Date(query.to) });
    }

    const logs = await qb.getMany();
    return logs.map((log) => this._decryptForRead(log));
  }

  private _decryptForRead(log: AuditLog): AuditLog {
    if (log.ipAddress) {
      try {
        log.ipAddress = this._encryptionService.decrypt(log.ipAddress);
      } catch (error) {
        this._logger.warn(
          `Failed to decrypt ipAddress for audit log #${log.id}`,
          error instanceof Error ? error.stack : undefined
        );
      }
    }

    if (log.metadata) {
      log.metadata = decryptAuditMetadata(log.metadata, (value) =>
        this._encryptionService.decrypt(value)
      ) as Record<string, unknown>;
    }

    return log;
  }
}
