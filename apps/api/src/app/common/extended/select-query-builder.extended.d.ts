import { ColumnQueryParameters } from "../utils/crud-helper.util";

declare module "typeorm" {
  interface SelectQueryBuilder<Entity> {
    andWhereMultipleColumns(
      this: SelectQueryBuilder<Entity>,
      filterObject: Partial<Record<keyof Entity, unknown>>,
      queriesParameters: ColumnQueryParameters<Entity>[]
    ): SelectQueryBuilder<Entity>;
  }
}
