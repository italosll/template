import { Brackets, ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { User } from "../../users/entities/user.entity";

export type GetQueryContract<T> = {
  [teste in keyof Partial<T>]: {
    where: string | Brackets | ObjectLiteral | ObjectLiteral[] | ((qb: SelectQueryBuilder<User>) => string),
    parameters?: ObjectLiteral
  }
};
