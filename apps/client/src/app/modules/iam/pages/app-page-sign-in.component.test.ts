import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { FormularyComponent } from "@client/common/components/app-formulary/app-formulary.component";
// import { render, screen } from "@testing-library/angular";
import { TemplatePageSignComponent } from "../components/app-template-page-sign.component";
import { PageSignInComponent } from "./app-page-sign-in.component";
import { TestBed } from "@angular/core/testing";
import { AccessService } from "@client/iam/services/app-access.service";
import { DialogsOpenerService } from "@client/common/services/app-dialogs-opener.service";
 describe("app-page-sign-in.component.ts", () => {
  it("should be true", async () => {
    await TestBed.configureTestingModule( {
      imports: [
        MatButtonModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        MatCardModule,
        FormularyComponent,
        TemplatePageSignComponent,
        RouterLink,
      ],
      providers: [
        {
          provide: AccessService,
          useValue: {}
        },
        {
          provide: ActivatedRoute,
          useValue: {}
        },
        {
          provide: DialogsOpenerService,
          useValue:{}
        }
      ]
    }).compileComponents();

    const component = TestBed.createComponent(PageSignInComponent);
    component.detectChanges();
    document.body.appendChild(component.nativeElement);

    const val = 16;
    console.log(val)



    expect(component).toBeTruthy();
  });
});
