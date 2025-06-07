import { AuditContract } from "./audit.contract";

export type FactoryContract<CreateDTO, UpdateDTO, ResponseDTO> = {
  create: (
    params: Partial<CreateDTO & AuditContract> | null,
    setFakeData?: boolean
  ) => CreateDTO;
  update: (
    params: Partial<UpdateDTO & AuditContract> | null,
    setFakeData?: boolean
  ) => UpdateDTO;
  response: (
    params: Partial<ResponseDTO & AuditContract> | null,
    setFakeData?: boolean
  ) => ResponseDTO;
};
