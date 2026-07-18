import { inject, signal } from "@angular/core";
import { applyEach, required } from "@angular/forms/signals";
import { FormModel } from "@client/common/model/app-form.model";
import { QuotationContract } from "@interfaces/quotation.contract";
import { forkJoin } from "rxjs";
import { ClientsHttpService } from "../../clients/http/app-clients.http.service";
import { ProductsHttpService } from "../../products/http/app-products.http.service";
import { ServiceOrdersHttpService } from "../../service-orders/http/app-service-orders.http.service";

export class QuotationModel extends FormModel<QuotationContract> {
  readonly ready = signal(false);

  constructor() {
    const clientsOptions: object[] = [];
    const productsOptions: object[] = [];
    const serviceOrdersOptions: object[] = [];

    const clientsHttp = inject(ClientsHttpService);
    const productsHttp = inject(ProductsHttpService);
    const serviceOrdersHttp = inject(ServiceOrdersHttpService);

    super(
      [
        {
          type: "default",
          inputs: [
            {
              type: "id",
              name: "id",
              initialValue: 0,
            },
            {
              type: "autocomplete",
              name: "clientId",
              label: "cliente",
              initialValue: 0,
              width: 6,
              options: clientsOptions,
              valueKey: "id",
              descriptionKey: "description",
            },
            {
              type: "text",
              name: "observation",
              label: "observacao",
              initialValue: "",
              width: 6,
            },
          ],
        },
        {
          type: "array",
          name: "products",
          label: "Produtos",
          inputs: [
            {
              type: "autocomplete",
              name: "productId" as keyof QuotationContract & string,
              label: "produto",
              initialValue: 0,
              width: 4,
              options: productsOptions,
              valueKey: "id",
              descriptionKey: "description",
              imageKey: "image",
            },
            {
              type: "text",
              name: "manufacturer" as keyof QuotationContract & string,
              label: "fabricante",
              initialValue: "",
              width: 2,
            },
            {
              type: "text",
              name: "unity" as keyof QuotationContract & string,
              label: "unidade",
              initialValue: "",
              width: 2,
            },
            {
              type: "text",
              name: "amount" as keyof QuotationContract & string,
              label: "quantidade",
              initialValue: 0,
              width: 1,
            },
            {
              type: "text",
              name: "price" as keyof QuotationContract & string,
              label: "preco",
              initialValue: 0,
              width: 2,
            },
            {
              type: "text",
              name: "discount" as keyof QuotationContract & string,
              label: "desconto",
              initialValue: 0,
              width: 1,
            },
          ],
        },
        {
          type: "array",
          name: "serviceOrders",
          label: "Ordens de Servico",
          inputs: [
            {
              type: "autocomplete",
              name: "serviceOrderId" as keyof QuotationContract & string,
              label: "ordem de servico",
              initialValue: 0,
              width: 6,
              options: serviceOrdersOptions,
              valueKey: "id",
              descriptionKey: "description",
            },
            {
              type: "text",
              name: "amount" as keyof QuotationContract & string,
              label: "quantidade",
              initialValue: 0,
              width: 2,
            },
            {
              type: "text",
              name: "price" as keyof QuotationContract & string,
              label: "preco",
              initialValue: 0,
              width: 2,
            },
            {
              type: "text",
              name: "discount" as keyof QuotationContract & string,
              label: "desconto",
              initialValue: 0,
              width: 2,
            },
          ],
        },
      ],
      (path) => {
        required(path.clientId);
        applyEach(path.products, (item) => {
          required(item.productId);
          required(item.amount);
          required(item.price);
        });
        applyEach(path.serviceOrders, (item) => {
          required(item.serviceOrderId);
          required(item.amount);
          required(item.price);
        });
      },
    );

    forkJoin({
      clients: clientsHttp.lookup(),
      products: productsHttp.lookup(),
      serviceOrders: serviceOrdersHttp.lookup(),
    }).subscribe(({ clients, products, serviceOrders }) => {
      clientsOptions.push(...(clients as object[]));
      productsOptions.push(...(products as object[]));
      serviceOrdersOptions.push(...(serviceOrders as object[]));
      this.ready.set(true);
    });
  }
}
