export class ResponseQuotationDTO {
  id!: number;
  clientId!: number;
  productIds?: number[];
  serviceOrderIds?: number[];
  observation?: string;
}
