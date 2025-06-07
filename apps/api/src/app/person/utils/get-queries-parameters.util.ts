import { ColumnQueryParameters } from "../../common/utils/crud-helper.util";
import { getAuditQuerys } from "../../common/utils/get-audit-query.util";
import { Person } from "../entities/person.entity";

export function getQueriesParameters(): ColumnQueryParameters<Person>[] {
  return [
    { where: "person.id", like: "id" },
    { where: "person.document", like: "document" },
    { where: "person.email", like: "email" },
    { where: "person.phoneNumber", like: "phoneNumber" },

    ...getAuditQuerys(),
  ];
}
