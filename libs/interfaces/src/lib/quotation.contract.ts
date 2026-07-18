import { QuotationProductContract } from "./quotation-product.contract";
import { QuotationServiceOrderContract } from "./quotation-service-order.contract";

export interface QuotationContract {
  id: number;
  clientId: number;
  products: QuotationProductContract[];
  serviceOrders: QuotationServiceOrderContract[];
  observation?: string;
}
