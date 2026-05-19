import { ColumnQueryParameters } from "../../common/utils/crud-helper.util";
import { getAuditQuerys } from "../../common/utils/get-audit-query.util";
import { PersonLegal } from "../entities/person-legal.entity";
import { PersonNatural } from "../entities/person-natural.entity";
import { Person } from "../entities/person.entity";

export function getQueriesParameters(): ColumnQueryParameters<PersonLegal& PersonNatural & Person>[] {
  return [
    { where: "person.id", like: "id" },
    { where: "person.document", like: "document" },
    { where: "person.email", like: "email" },
    { where: "person.phoneNumber", like: "phoneNumber" },

    ...getAuditQuerys(),
  ];
}
