import { FileContract } from "@interfaces/file.contract";
import { ProductLookupContract } from "@interfaces/product-lookup.contract";
import { ResponseLookupDTO } from "../../common/dto/response-lookup.dto";

export class ResponseProductLookupDTO
  extends ResponseLookupDTO
  implements ProductLookupContract
{
  public image?: FileContract;
  public price?: number;
  public amount?: number;
}
