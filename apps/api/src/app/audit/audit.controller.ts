import { Controller, Get, Query, ValidationPipe } from "@nestjs/common";
import { Permissions } from "@api/iam/authorization/decorators/permissions.decorator";
import { PERMISSION_CODES } from "@api/iam/permissions/permissions.constant";
import { AuditService } from "./audit.service";
import { QueryAuditDTO } from "./dto/query-audit.dto";
import { AuditLog } from "./entities/audit-log.entity";

@Controller("audits")
export class AuditController {
  constructor(private readonly _auditService: AuditService) {}

  @Get()
  @Permissions(PERMISSION_CODES.AUDIT_READ)
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryAuditDTO
  ): Promise<AuditLog[]> {
    return this._auditService.findByFilters(query);
  }
}
