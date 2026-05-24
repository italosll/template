import { pattern, required } from "@angular/forms/signals";
import { SignalRule } from "@client/common/components/app-formulary/scheme.contract";
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
            initialValue: "",
            rules: [(path) => required(path)]  as SignalRule<any>[],
            width: 12,
          },
          {
            type: "text",
            name: "companyRealName",
            label: "Razão Social",
            initialValue: "",
            rules: [(path) => required(path)],
            width: 12,
          },
          {
            type: "text",
            name: "document",
            label: "CNPJ",
            initialValue: "",
            rules: [
              (path) => required(path),
              (path) =>
                pattern(path.document, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
            ],
            width: 12,
          },
        ],
      },
    ]);
  }
}
