import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { QuotationContract } from "@interfaces/quotation.contract";
import { getQuotationsRoutes } from "../app-index.routes";

@Injectable()
export class QuotationsHttpService extends BaseHttpService<
  QuotationContract,
  QuotationContract,
  QuotationContract,
  QuotationContract
> {
  constructor() {
    super(getQuotationsRoutes().api.quotations);
  }

  override create(body: QuotationContract) {
    return super.create(this._normalize(body));
  }

  override update(body: QuotationContract) {
    return super.update(this._normalize(body));
  }

  private _normalize(body: QuotationContract): QuotationContract {
    return {
      ...body,
      id: Number(body.id) || 0,
      clientId: Number(body.clientId),
      observation: body.observation || undefined,
      products: (body.products ?? []).map((item) => ({
        ...item,
        id: item.id ? Number(item.id) : undefined,
        productId: Number(item.productId),
        amount: Number(item.amount),
        price: Number(item.price),
        discount: Number(item.discount ?? 0),
      })),
      serviceOrders: (body.serviceOrders ?? []).map((item) => ({
        ...item,
        id: item.id ? Number(item.id) : undefined,
        serviceOrderId: Number(item.serviceOrderId),
        amount: Number(item.amount),
        price: Number(item.price),
        discount: Number(item.discount ?? 0),
      })),
    };
  }
}
