export interface QuotationProductContract {
  id?: number;
  productId: number;
  manufacturer?: string;
  unity?: string;
  amount: number;
  price: number;
  discount?: number;
}
