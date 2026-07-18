import {  signal } from "@angular/core";

export class SignUpStepUserModel  {
  constructor() {

    const signal2 = signal([
      {
        type: "text",
        name: "email",
        label: "email",
        value: "",
      }
    ])
  }
   
}
