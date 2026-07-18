import { ServiceOrderLookupContract } from "@interfaces/service-order-lookup.contract";
import { ResponseLookupDTO } from "../../common/dto/response-lookup.dto";

export class ResponseServiceOrderLookupDTO
  extends ResponseLookupDTO
  implements ServiceOrderLookupContract
{
  public price?: number;
}
