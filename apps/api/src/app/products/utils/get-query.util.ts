import { GetQueryContract } from "../../common/contracts/get-query.contract";
import { getAuditQuerys } from "../../common/utils/get-query.util";
import { AuditContract } from "../../common/contracts/audit.contract";
import { Product } from "../entities/product.entity";
import { ProductContract } from "@template/interfaces";

export const getQuerys =(entity:Partial<ProductContract & AuditContract>):GetQueryContract<Product> =>( {
  name:{
    where:`LOWER(name) LIKE LOWER(:name)`,
    parameters:{ name: `%${entity?.name}%`},
  },
  code:{
    where:`code LIKE :code`,
    parameters:{ code: `%${entity?.code}%`},
  },
  id:{
    where:`id LIKE :id`,
    parameters:{ id: `%${entity?.id}%`},
  },
  ...getAuditQuerys(entity)
})
