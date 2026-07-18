import { QuotationServiceOrderContract } from "@interfaces/quotation-service-order.contract";

export class ResponseQuotationServiceOrderDTO
  implements QuotationServiceOrderContract
{
  id!: number;
  serviceOrderId!: number;
  amount!: number;
  price!: number;
  discount!: number;
}
