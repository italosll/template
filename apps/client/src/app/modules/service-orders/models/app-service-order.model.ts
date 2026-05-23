import { Validators } from "@angular/forms";
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
          },
          {
            type: "text",
            name: "description",
            label: "descricao",
            validators: [Validators.required],
            width: 6,
          },
          {
            type: "text",
            name: "price",
            label: "preco",
            validators: [Validators.required],
            width: 6,
          },
        ],
      },
    ]);
  }
}
