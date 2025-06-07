import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  selector: "app-template-page-sign",
  standalone: true,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
      }
      img {
        width: 50%;
        height: 100%;
        display: None;
      }

      .actionButton {
        width: 100%;
      }

      mat-card {
        width: 100%;
        height: 100%;
        min-height: 100%;
        border-radius: 0px !important;
      }

      mat-card-actions {
        margin-top: auto;
        display: flex;
        flex-direction: column !important;
        gap: 0.5rem;
      }

      @media (min-width: 800px) {
        img {
          width: calc(100% - 400px);
          height: 100%;
          display: block;
        }
        .container {
          mat-card {
            border-radius: 5px;
            width: 400px;
          }
        }
      }
    `,
  ],
  template: `
    <div class="container">
      <img src="assets/wave-pattern-background.svg" />
      <ng-content></ng-content>
    </div>
  `,
})
export class TemplatePageSignComponent {}
