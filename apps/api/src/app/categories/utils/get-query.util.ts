import { CategoryContract } from "@template/interfaces";
import { GetQueryContract } from "../../common/contracts/get-query.contract";
import { getAuditQuerys } from "../../common/utils/get-query.util";
import { AuditContract } from "../../common/contracts/audit.contract";
import { Category } from "../entities/category.entity";

export const getQuerys =(entity:Partial<CategoryContract & AuditContract>):GetQueryContract<Category> =>( {
  name:{
    where:`LOWER(name) LIKE LOWER(:name)`,
    parameters:{ name: `%${entity?.name}%`},
  },
  id:{
    where:`id LIKE :id`,
    parameters:{ id: `%${entity?.id}%`},
  },
  code:{
    where:`code LIKE :code`,
    parameters:{ code: `%${entity?.code}%`},
  },
  ...getAuditQuerys(entity)
})
