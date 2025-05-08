import { ColumnQueryParameters } from "./crud-helper.util";
import { AuditContract } from "../contracts/audit.contract";

export function getAuditQuerys():ColumnQueryParameters<AuditContract>[]{
  return [
    { where: "createdAt", like: "createdAt" },
    { where: "updatedAt", like: "updatedAt" },
    { where: "deletedAt", like: "deletedAt" },
    { where: "recoveredAt", like: "recoveredAt" },
  ];
}