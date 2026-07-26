import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import {
  AuditLogContract,
  QueryAuditContract,
} from "@interfaces/audit-log.contract";
import { Observable } from "rxjs";
import { getAuditRoutes } from "../app-index.routes";

@Injectable()
export class AuditHttpService extends BaseHttpService<
  AuditLogContract,
  AuditLogContract,
  never,
  never
> {
  constructor() {
    super(getAuditRoutes().api.audits);
  }

  findByFilters(filters: QueryAuditContract): Observable<AuditLogContract[]> {
    const cleaned: { [key: string]: unknown } = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleaned[key] = value;
      }
    });
    return this.findAll(cleaned);
  }
}
