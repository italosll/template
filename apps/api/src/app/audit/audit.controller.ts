import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  ValidationPipe,
} from "@nestjs/common";
import { REQUEST_USER_KEY } from "@api/iam/iam.constants";
import { Permissions } from "@api/iam/authorization/decorators/permissions.decorator";
import { AuthorizationService } from "@api/iam/authorization/authorization.service";
import { PERMISSION_CODES } from "@interfaces/permission-code.contract";
import { ActiveUserContract } from "@interfaces/active-user.contract";
import { Request } from "express";
import { AuditService } from "./audit.service";
import { QueryAuditDTO } from "./dto/query-audit.dto";
import { AuditLog } from "./entities/audit-log.entity";

@Controller("audits")
export class AuditController {
  constructor(
    private readonly _auditService: AuditService,
    private readonly _authorizationService: AuthorizationService
  ) {}

  @Get()
  @Permissions(PERMISSION_CODES.AUDIT_READ)
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryAuditDTO,
    @Req() request: Request
  ): Promise<AuditLog[]> {
    const user = (request as unknown as Record<string, unknown>)[
      REQUEST_USER_KEY
    ] as ActiveUserContract | undefined;
    if (!user?.sub || user.tenantId == null) {
      throw new UnauthorizedException();
    }

    const isSuperAdmin = await this._authorizationService.isSuperAdmin(user.sub);
    if (!isSuperAdmin) {
      query.tenantId = user.tenantId;
    } else if (query.tenantId == null) {
      query.tenantId = user.tenantId;
    }

    return this._auditService.findByFilters(query);
  }
}
