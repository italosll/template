import { ColumnQueryParameters } from "../../common/utils/crud-helper.util";
import { getAuditQuerys } from "../../common/utils/get-audit-query.util";
import { Client } from "../entities/client.entity";

export function getQueriesParameters(): ColumnQueryParameters<Client>[] {
  return [
    { where: "client.id", like: "id" },
    { where: "client.personLegalId", like: "personLegalId" },
    { where: "client.personNaturalId", like: "personNaturalId" },
    ...getAuditQuerys(),
  ];
}
