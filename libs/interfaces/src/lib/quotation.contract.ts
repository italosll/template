export interface QuotationContract {
  id: number;
  clientId: number;
  productIds: number[];
  serviceOrderIds: number[];
  observation?: string;
}
