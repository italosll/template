import { AuditContract } from "../contracts/audit.contract";

export function bindAuditProperties(instance:object & AuditContract, values:Partial<object & AuditContract> ){
    instance.createdAt = values?.createdAt;
    instance.updatedAt = values?.updatedAt;
    instance.deletedAt = values?.deletedAt;
    instance.recoveredAt = values?.recoveredAt;
}