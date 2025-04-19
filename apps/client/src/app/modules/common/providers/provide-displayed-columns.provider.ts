import { InjectionToken } from "@angular/core";
import { TableColumnModel } from "../components/app-table/app-table-column.model";
import { AUDIT_TABLE_COLUMNS } from "../components/app-table/audit-table-columns.constant";

export const DisplayedColumnsToken = new InjectionToken<TableColumnModel[]>('DisplayedColumnsToken'); 
export function provideDisplayedColumns(displayedColumns:TableColumnModel[], displayAuditColumns = true){
    return{
        provide: DisplayedColumnsToken,
        useValue: [
            ...displayedColumns, 
            ...(displayAuditColumns ? AUDIT_TABLE_COLUMNS : []),
        ]
    }
}
