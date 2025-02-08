import { UserContract } from "@interfaces/user.contract";
import { GetQueryContract } from "../../common/contracts/get-query.contract";
import { getAuditQuerys } from "../../common/utils/get-query.util";
import { User } from "../entities/user.entity";
import { AuditContract } from "../../common/contracts/audit.contract";

export const getQuerys =(entity:Partial<UserContract & AuditContract>):GetQueryContract<User> =>( {
  filterableEmail:{
    where:`LOWER(filterableEmail) LIKE LOWER(:filterableEmail)`,
    parameters:{ filterableEmail: `%${entity?.filterableEmail}%`},
  },
  id:{
    where:`id LIKE :id`,
    parameters:{ id: `%${entity?.id}%`},
  },
  ...getAuditQuerys(entity)
})
