import { ResponseQuotationProductDTO } from "./response-quotation-product.dto";
import { ResponseQuotationServiceOrderDTO } from "./response-quotation-service-order.dto";

export class ResponseQuotationDTO {
  id!: number;
  clientId!: number;
  products!: ResponseQuotationProductDTO[];
  serviceOrders!: ResponseQuotationServiceOrderDTO[];
  observation?: string;
}
