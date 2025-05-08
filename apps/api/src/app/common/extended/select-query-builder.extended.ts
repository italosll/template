import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { ColumnQueryParameters } from "../utils/crud-helper.util";

declare module 'typeorm/query-builder/SelectQueryBuilder' {
    interface SelectQueryBuilder<Entity> {
        andWhereMultipleColumns(
            this: SelectQueryBuilder<Entity>, 
            filterObject:Partial<Record<keyof Entity,unknown>>, 
            queriesParameters: ColumnQueryParameters<Entity>[]
        ): SelectQueryBuilder<Entity>
    }
}


SelectQueryBuilder.prototype.andWhereMultipleColumns = function<Entity>(filterObject:Partial<Record<keyof Entity,unknown>>, columnNames: ColumnQueryParameters<Entity>[]){
    
    const columnNamesToQuery = columnNames.filter(
        column => filterObject[column.like] !== undefined && filterObject[column.like] !== null
    );

    columnNamesToQuery.forEach(column => {
        this.andWhere(
            `LOWER(${String(column.where)}) LIKE LOWER(:${String(column.like)})`,
            { [column.like]: `%${filterObject[column.like]}%` }); 
    });

    return this;
}