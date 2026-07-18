import { QuotationProductContract } from "@interfaces/quotation-product.contract";

export class ResponseQuotationProductDTO implements QuotationProductContract {
  id!: number;
  productId!: number;
  manufacturer?: string;
  unity?: string;
  amount!: number;
  price!: number;
  discount!: number;
}
