export interface QuotationServiceOrderContract {
  id?: number;
  serviceOrderId: number;
  amount: number;
  price: number;
  discount?: number;
}
