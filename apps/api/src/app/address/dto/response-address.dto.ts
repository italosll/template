import { AddressContract } from "@interfaces/address.contract";
import { AuditContract } from "../../common/contracts/audit.contract";

export class ResponseAddressDTO implements AddressContract, AuditContract {
  id!: number;
  streetAddress!: string;
  neighborhood!: string;
  city!: string;
  state!: string;
  postalCode!: string;
  country!: string;
  personId!: number;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;
  recoveredAt!: Date;
}
