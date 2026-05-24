import { PERSON_TYPE } from "@client/common/constants/person-type.constant";
import { FormModel } from "@client/common/model/app-form.model";

export type ClientFormValue = {
  id?: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  document?: string;
  companyRealName?: string;
  birthDate?: string;
  tipoPessoa?: string;
};



export class ClientModel extends FormModel<ClientFormValue> {
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
            type:"radio",
            name:"tipoPessoa",
            title:"Tipo",
            width:12,
            initialValue:PERSON_TYPE.NATURAL,
            options:[
              {description:"Pessoa Física", value:PERSON_TYPE.NATURAL},
              {description:"Pessoa Jurídica", value:PERSON_TYPE.LEGAL},
            ]
          },
          {
            type: "text",
            name: "name",
            label: "nome",
            width: 6,
          },
          {
            type: "text",
            name: "email",
            label: "email",
            width: 6,
          },
          {
            type: "text",
            name: "phoneNumber",
            label: "telefone",
            width: 6,
          },
          {
            type: "text",
            name: "document",
            label: "documento",
            width: 6,
          },
          {
            type: "text",
            name: "companyRealName",
            label: "razao social",
            width: 6,
          },
          {
            type: "text",
            name: "birthDate",
            label: "data de nascimento",
            width: 6,
          },
        ],
      },
    ]);

  }


}
