import { AuditContract } from "../../common/contracts/audit.contract";

const CREATED_AT_DATE = new Date(2020,0,1);
const UPDATED_AT_DATE = new Date(2020,0,2);
const DELETED_AT_DATE = new Date(2020,0,3);
const RECOVERED_AT_DATE = new Date(2020,0,4);


export function bindAuditProperties(instance:object & AuditContract, values:Partial<object & AuditContract> ){
    instance.createdAt = values?.createdAt ?? CREATED_AT_DATE;
    instance.updatedAt = values?.updatedAt ?? UPDATED_AT_DATE;
    instance.deletedAt = values?.deletedAt ?? DELETED_AT_DATE;
    instance.recoveredAt = values?.recoveredAt ?? RECOVERED_AT_DATE;
}