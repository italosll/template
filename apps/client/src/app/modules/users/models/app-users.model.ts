import { effect, untracked } from "@angular/core";
import { required } from "@angular/forms/signals";
import { FormModel } from "@client/common/model/app-form.model";
import { UserContract } from "@interfaces/user.contract";

export class UserModel extends FormModel<UserContract> {
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
            name: "email",
            label: "email",
            initialValue: "",
            width: 3,
          },
        ],
      },
    ],
    (schemaPath) => {
      required(schemaPath.email);
    },
    [
      //---ANTES
      // this.form.controls.id.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((id) => {
      //   if (id) {
      //     this.form.controls.email.reset();
      //   }
      // })
      //---AGORA
      (form) => effect(() => {
        form.id()
        untracked(form.email).reset();
      }),
      //--- OU ainda podemos isolar essa função numa pasta e dar um nome mais semântico a ela,
      (form)=>resetarEmailAoMudarId(form)
    ]
  );
  }
}
const resetarEmailAoMudarId = (form:any) => effect((form: any) => {
  form.id()
  // untracked(form.email).reset();
})