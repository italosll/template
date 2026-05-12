import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { ColumnQueryParameters } from "../utils/crud-helper.util";

declare module "typeorm/query-builder/SelectQueryBuilder" {
  interface SelectQueryBuilder<Entity> {
    andWhereMultipleColumns(
      this: SelectQueryBuilder<Entity>,
      filterObject: { textToSearch?:string },
      queriesParameters: ColumnQueryParameters<Entity>[]
    ): SelectQueryBuilder<Entity>;
  }
}

SelectQueryBuilder.prototype.andWhereMultipleColumns = function <Entity>(
  filterObject: { textToSearch?:string, id?:number },
  columnNames: ColumnQueryParameters<Entity>[]
) {

  if(filterObject.id){
    const condition = `LOWER(id) LIKE LOWER(:id)`

    this.andWhere(
      condition,
      { id: `%${filterObject.id}%` }
    )

    return this;
  }

  if (!filterObject.textToSearch || !filterObject.textToSearch.trim()) {
    return this;
  }

  columnNames.forEach((column,index) => {

    const condition = `LOWER(${String(column.where)}) LIKE LOWER(:${String(column.like)})`
    if(index === 0) {
      this.andWhere(
        condition,
        { [column.like]: `%${filterObject.textToSearch}%` }
      )
    }
    this.orWhere(
      condition,
      { [column.like]: `%${filterObject.textToSearch}%` }
    );
  });

  return this;
};
