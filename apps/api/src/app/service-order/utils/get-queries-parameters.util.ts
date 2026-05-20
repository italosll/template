import { ColumnQueryParameters } from "../../common/utils/crud-helper.util";
import { getAuditQuerys } from "../../common/utils/get-audit-query.util";
import { ServiceOrder } from "../entities/service-order.entity";

export function getQueriesParameters(): ColumnQueryParameters<ServiceOrder>[] {
  return [
    { where: "serviceOrder.id", like: "id" },
    { where: "serviceOrder.description", like: "description" },
    { where: "serviceOrder.price", like: "price" },
    ...getAuditQuerys(),
  ];
}
