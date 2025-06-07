import { Validators } from "@angular/forms";
import { FormModel } from "@client/common/model/app-form.model";
import { ProductContract } from "@interfaces/product.contract";

export class ProductModel extends FormModel<ProductContract> {
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
            type: "image",
            name: "image",
            label: "imagem",
            validators: [],
            width: 3,
          },
          {
            type: "text",
            name: "code",
            label: "codigo",
            validators: [Validators.required],
            width: 3,
          },
          {
            type: "text",
            name: "description",
            label: "descricao",
            validators: [],
            width: 3,
          },
          {
            type: "text",
            name: "name",
            label: "nome",
            validators: [Validators.required],
            width: 3,
          },
        ],
      },
    ]);
  }
}
