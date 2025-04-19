import { TableColumnModel } from "./app-table-column.model";

export const AUDIT_TABLE_COLUMNS = [
    new TableColumnModel('Data cricação', 'createdAt', 'dateTime'),
    new TableColumnModel('Data atualização', 'updatedAt', 'dateTime'),
    new TableColumnModel('Data exclusão', 'deletedAt', 'dateTime'),
    new TableColumnModel('Data recuperação', 'recoveredAt', 'dateTime'),
]