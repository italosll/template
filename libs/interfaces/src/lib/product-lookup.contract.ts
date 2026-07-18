import { FileContract } from "./file.contract";
import { LookupContract } from "./lookup.contract";

export interface ProductLookupContract extends LookupContract {
  image?: FileContract;
  price?: number;
  amount?: number;
}
