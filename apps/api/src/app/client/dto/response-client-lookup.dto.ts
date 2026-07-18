import { ClientLookupContract } from "@interfaces/client-lookup.contract";
import { ResponseLookupDTO } from "../../common/dto/response-lookup.dto";

export class ResponseClientLookupDTO
  extends ResponseLookupDTO
  implements ClientLookupContract {}
