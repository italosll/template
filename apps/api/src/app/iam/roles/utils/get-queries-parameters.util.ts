
import { ColumnQueryParameters } from "@api/common/utils/crud-helper.util";
import { Role } from "../entities/role.entity";
import { getAuditQuerys } from "@api/common/utils/get-audit-query.util";

export function getQueriesParameters():ColumnQueryParameters<Role>[]
 {
  return [
  { where: "role.id",  like: "id" },
  { where: "role.name", like: "name" },
   ...getAuditQuerys()
 ]
}
 
