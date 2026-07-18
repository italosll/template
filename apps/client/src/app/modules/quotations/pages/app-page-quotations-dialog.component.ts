import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DialogSaveComponent } from "@client/common/components/app-dialog/app-dialog-save.component";
import { QuotationModel } from "../models/app-quotation.model";

@Component({
  selector: "app-page-quotations-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogSaveComponent, MatProgressSpinnerModule],
  template: `
    @if (formModel.ready()) {
      <app-dialog-save [formModel]="formModel" title="Orcamento" />
    } @else {
      <mat-spinner
        style="position: absolute"
        class="z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      ></mat-spinner>
    }
  `,
})
export class DialogQuotationComponent {
  protected formModel = new QuotationModel();
}
