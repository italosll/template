import { UserContract } from "@interfaces/user.contract";
import { GetQueryContract } from "../../common/contracts/get-query.contract";
import { User } from "../entities/user.entity";
import { AuditContract } from "../../common/contracts/audit.contract";
import { getAuditQuerys } from "../../common/utils/get-audit-query.util";

export const getQuerys =(entity:Partial<UserContract & AuditContract>):GetQueryContract<User> =>( {
  filterableEmail:{
    where:`LOWER(filterableEmail) LIKE LOWER(:filterableEmail)`,
    parameters:{ filterableEmail: `%${entity?.filterableEmail}%`},
  },
  id:{
    where:`id LIKE :id`,
    parameters:{ id: `%${entity?.id}%`},
  },
  ...getAuditQuerys()
})
