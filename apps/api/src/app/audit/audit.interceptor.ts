import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ActiveUserContract } from "@interfaces/active-user.contract";
import { REQUEST_USER_KEY } from "@api/iam/iam.constants";
import { AuthorizationService } from "@api/iam/authorization/authorization.service";
import { AuditService } from "./audit.service";
import { API_GLOBAL_PREFIX, AUDITED_HTTP_METHODS } from "./audit.constants";

/**
 * Globally audits every write request (POST/PUT/PATCH/DELETE).
 * Only collects raw data; all LGPD sanitization/encryption is done
 * by AuditService. Persistence is fire-and-forget so auditing never
 * breaks or slows down the actual response.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly _logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly _auditService: AuditService,
    private readonly _authorizationService: AuthorizationService
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    if (!AUDITED_HTTP_METHODS.has(request.method)) {
      return next.handle();
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const response = context.switchToHttp().getResponse<Response>();
          this._recordSafely(request, startTime, response.statusCode, {
            response: responseBody,
          });
        },
        error: (error: unknown) => {
          const statusCode =
            error instanceof HttpException
              ? error.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;
          this._recordSafely(request, startTime, statusCode, {
            error: error instanceof Error ? error.message : String(error),
          });
        },
      })
    );
  }

  /** Builds and persists the audit entry without awaiting in the request pipeline. */
  private _recordSafely(
    request: Request,
    startTime: number,
    statusCode: number,
    resultMetadata: Record<string, unknown>
  ): void {
    this._buildAndRecord(request, startTime, statusCode, resultMetadata).catch(
      (error) => {
        this._logger.error(
          `Failed to record audit entry for ${request.method} ${request.path}`,
          error instanceof Error ? error.stack : undefined
        );
      }
    );
  }

  private async _buildAndRecord(
    request: Request,
    startTime: number,
    statusCode: number,
    resultMetadata: Record<string, unknown>
  ): Promise<void> {
    const executionTimeMs = Date.now() - startTime;
    const user = (request as unknown as Record<string, unknown>)[
      REQUEST_USER_KEY
    ] as ActiveUserContract | undefined;
    const path = this._stripGlobalPrefix(request.path);
    const { resourceType, resourceId } = this._parseResource(path, request);

    const isSuperUser = user?.sub
      ? await this._authorizationService.isSuperAdmin(user.sub)
      : false;

    await this._auditService.record({
      action: `${request.method} ${path}`,
      userId: user?.sub,
      tenantId: this._resolveTenantId(request, user),
      isSuperUser,
      resourceType,
      resourceId,
      statusCode,
      executionTimeMs,
      ipAddress: this._resolveIp(request),
      metadata: {
        body: request.body,
        query: request.query,
        params: request.params,
        ...resultMetadata,
      },
    });
  }

  private _stripGlobalPrefix(path: string): string {
    const prefix = `/${API_GLOBAL_PREFIX}`;
    if (path === prefix) {
      return "/";
    }
    return path.startsWith(`${prefix}/`) ? path.slice(prefix.length) : path;
  }

  private _parseResource(
    path: string,
    request: Request
  ): { resourceType?: string; resourceId?: string } {
    const segments = path.split("/").filter(Boolean);
    const resourceType = segments[0];

    const paramId = (request.params as Record<string, string | undefined>)?.[
      "id"
    ];
    const secondSegment = segments[1];
    const resourceId =
      paramId ??
      (secondSegment && /^\d+$/.test(secondSegment)
        ? secondSegment
        : undefined);

    return { resourceType, resourceId };
  }

  private _resolveTenantId(
    request: Request,
    user: ActiveUserContract | undefined
  ): number | undefined {
    const candidates = [
      (request.body as Record<string, unknown>)?.["tenantId"],
      (request.query as Record<string, unknown>)?.["tenantId"],
      user?.tenantId,
    ];

    for (const candidate of candidates) {
      const parsed = Number(candidate);
      if (candidate !== undefined && candidate !== null && !isNaN(parsed)) {
        return parsed;
      }
    }
    return undefined;
  }

  private _resolveIp(request: Request): string | undefined {
    const forwarded = request.headers["x-forwarded-for"];
    const forwardedIp = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded?.split(",")[0]?.trim();

    return forwardedIp || request.ip || undefined;
  }
}
