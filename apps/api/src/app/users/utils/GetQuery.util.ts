import { UserContract } from "@template/interfaces";
import { GetQueryContract } from "../../common/contracts/GetQuery.contract";
import { getAuditQuerys } from "../../common/utils/GetQuery.util";
import { User } from "../entities/user.entity";
import { AuditContract } from "../../common/contracts/Audit.contract";

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
