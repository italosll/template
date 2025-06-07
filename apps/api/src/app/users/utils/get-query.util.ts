import { UserContract } from "@interfaces/user.contract";
import { AuditContract } from "../../common/contracts/audit.contract";
import { GetQueryContract } from "../../common/contracts/get-query.contract";
import { getAuditQuerys } from "../../common/utils/get-audit-query.util";
import { User } from "../entities/user.entity";

export const getQuerys = (
  entity: Partial<UserContract & AuditContract>
): GetQueryContract<User> => ({
  filterableEmail: {
    where: `LOWER(filterableEmail) LIKE LOWER(:filterableEmail)`,
    parameters: { filterableEmail: `%${entity?.filterableEmail}%` },
  },
  id: {
    where: `id LIKE :id`,
    parameters: { id: `%${entity?.id}%` },
  },
  ...getAuditQuerys(),
});
