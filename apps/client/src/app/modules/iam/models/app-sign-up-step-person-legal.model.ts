import { Validators } from "@angular/forms";
import { FormModel } from "@client/common/model/app-form.model";
import { PersonLegalContract } from "@interfaces/person.contract";

export class SignUpStepPersonLegalModel extends FormModel<PersonLegalContract> {
  constructor() {
    super([
      {
        type: "default",
        inputs: [
          {
            type: "text",
            name: "name",
            label: "Nome Fantasia",
            validators: [Validators.required],
            width: 12,
          },
          {
            type: "text",
            name: "companyRealName",
            label: "Razão Social",
            validators: [Validators.required],
            width: 12,
          },
          {
            type: "text",
            name: "document",
            label: "CNPJ",
            validators: [
              Validators.required,
              Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
            ],
            width: 12,
          },
        ],
      },
    ]);
  }
}
