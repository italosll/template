import { GetQueryContract } from "../../common/contracts/GetQuery.contract";
import { AuditContract } from "../contracts/Audit.contract";


export const getAuditQuerys =(entity:Partial<AuditContract>):GetQueryContract<AuditContract> =>( {
  createdAt:{
    where:`createdAt LIKE :createdAt`,
    parameters:{ createdAt: `%${entity?.createdAt}%`},
  },
  updatedAt:{
    where:`updatedAt LIKE :updatedAt`,
    parameters:{ updatedAt: `%${entity?.updatedAt}%`},
  },
  deletedAt:{
    where:`deletetedAt LIKE :deletetedAt`,
    parameters:{ deletetedAt: `%${entity?.deletedAt}%`},
  },
  recoveredAt:{
    where:`recoveredAt LIKE :recoveredAt`,
    parameters:{ recoveredAt: `%${entity?.recoveredAt}%`},
  }
})
