import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export function createMockQueryBuilder<
  T extends ObjectLiteral
>(): DeepMockProxy<SelectQueryBuilder<T>> {
  const qb = mockDeep<SelectQueryBuilder<T>>();
  qb.andWhereMultipleColumns.mockReturnThis();
  qb.loadRelationIdAndMap.mockReturnThis();
  return qb;
}
