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
     const idColumn = columnNames.find(c => c.like === "id")!;
    const condition = "raw" in idColumn ? idColumn.raw : `LOWER(${String(idColumn.where)}) LIKE LOWER(:${String(idColumn.like)})`

    this.andWhere(
      condition,
      { id: filterObject.id }
    )

    return this;
  }

  if (!filterObject.textToSearch || !filterObject.textToSearch.trim()) {
    return this;
  }

  columnNames.forEach((column,index) => {

    const condition = "raw" in column 
    ? column.raw 
    : `LOWER(${String(column.where)}) LIKE LOWER(:${String(column.like)})`


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
