import { getAuditQuerys } from "../../common/utils/get-query.util";
import { Product } from "../entities/product.entity";
import { ColumnQueryParameters } from "../../common/utils/crud-helper.util";

export function getQueriesParameters():ColumnQueryParameters<Product>[]
 {
  return [
  { where: "product.id",  like: "id" },
  { where: "product.code", like: "code" },
  { where: "product.name", like: "name" },
  { where: "product.description", like: "description" },
   ...getAuditQuerys()
 ]
}
 
