import { AuditContract } from "./audit.contract"

export type FactoryContract<CreateDTO, UpdateDTO, ResponseDTO> = {
 create: (params:Partial<CreateDTO & AuditContract>, setFakeData?:boolean) => CreateDTO;
 update: (params:Partial<UpdateDTO & AuditContract>, setFakeData?:boolean) => UpdateDTO;
 response:  (params:Partial<ResponseDTO & AuditContract>, setFakeData?:boolean) => ResponseDTO;
}
