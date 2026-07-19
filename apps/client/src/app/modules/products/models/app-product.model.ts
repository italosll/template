import { required } from "@angular/forms/signals";
import { FormModel } from "@client/common/model/app-form.model";
import { ProductContract } from "@interfaces/product.contract";

export class ProductModel extends FormModel<ProductContract> {
  constructor() {
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
              type: "image",
              name: "image",
              label: "imagem",
              width: 3,
            },
            {
              type: "text",
              name: "code",
              label: "codigo",
              initialValue: "",
              width: 3,
            },
            {
              type: "text",
              name: "description",
              label: "descricao",
              initialValue: "",
              width: 3,
            },
            {
              type: "text",
              name: "name",
              label: "nome",
              initialValue: "",
              width: 3,
            },
            {
              type: "text",
              name: "cost",
              label: "custo",
              initialValue: 0,
              width: 3,
            },
            {
              type: "text",
              name: "sellingPrice",
              label: "preco de venda",
              initialValue: 0,
              width: 3,
            },
            {
              type: "text",
              name: "maxDiscountPercentage",
              label: "desconto maximo %",
              initialValue: 0,
              width: 3,
            },
          ],
        },
      ],
      (path) => {
        required(path.name);
      },
    );
  }
}
