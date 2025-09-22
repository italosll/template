import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { ObjectLiteral } from "typeorm";
import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";

export function createMockQueryBuilder<
  T extends ObjectLiteral
>(): DeepMockProxy<SelectQueryBuilder<T>> {
  const qb = mockDeep<SelectQueryBuilder<T>>();
  qb.andWhereMultipleColumns.mockReturnThis();
  qb.loadRelationIdAndMap.mockReturnThis();
  return qb;
}
