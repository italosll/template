import { ColumnQueryParameters } from "../../common/utils/crud-helper.util";
import { getAuditQuerys } from "../../common/utils/get-audit-query.util";
import { Quotation } from "../entities/quotation.entity";

export function getQueriesParameters(): ColumnQueryParameters<Quotation>[] {
  return [
    { where: "quotation.id", like: "id" },
    { where: "quotation.clientId", like: "clientId" },
    { where: "quotation.observation", like: "observation" },
    ...getAuditQuerys(),
  ];
}
