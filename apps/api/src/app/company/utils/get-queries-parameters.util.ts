import { ColumnQueryParameters } from "../../common/utils/crud-helper.util";
import { getAuditQuerys } from "../../common/utils/get-audit-query.util";
import { Company } from "../entities/companies.entity";

export function getQueriesParameters():ColumnQueryParameters<Company>[]
 {
  return [
  { where: "product.id",  like: "id" },
  { where: "product.fantasyName", like: "fantasyName" },
  { where: "product.companyName", like: "companyName" },
  { where: "product.cnpj", like: "cnpj" },
   ...getAuditQuerys()
 ]
}
 
