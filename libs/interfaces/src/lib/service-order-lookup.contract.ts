import { LookupContract } from "./lookup.contract";

export interface ServiceOrderLookupContract extends LookupContract {
  price?: number;
}
