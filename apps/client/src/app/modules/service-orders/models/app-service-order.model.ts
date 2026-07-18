import { required } from "@angular/forms/signals";
import { FormModel } from "@client/common/model/app-form.model";
import { ServiceOrderContract } from "@interfaces/service-order.contract";

export class ServiceOrderModel extends FormModel<ServiceOrderContract> {
  constructor() {
    super([
      {
        type: "default",
        inputs: [
          {
            type: "id",
            name: "id",
            initialValue: 0,
          },
          {
            type: "text",
            name: "description",
            label: "descricao",
            initialValue: "",
            width: 6,
          },
          {
            type: "text",
            name: "price",
            label: "preco",
            initialValue: 0,
            width: 6,
          },
        ],
      },
    ]);
  }
}
