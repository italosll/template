import { ColumnQueryParameters } from "../../common/utils/crud-helper.util";
import { getAuditQuerys } from "../../common/utils/get-audit-query.util";
import { Client } from "../entities/client.entity";

export function getQueriesParameters(): ColumnQueryParameters<Client>[] {
  return [
    { where: "client.id", like: "id" },
    {
      raw: "LOWER(naturalPerson.name) LIKE LOWER(:personNaturalId)",
      like: "personNaturalId",
    },
    {
      raw: "LOWER(legalPerson.name) LIKE LOWER(:personLegalId)",
      like: "personLegalId",
    },
    ...getAuditQuerys(),
  ];
}
