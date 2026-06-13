import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  inject,
  input,
  model,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldControl } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FileUtil } from "@client/common/utils/app-file.util";
import { FileContract } from "@interfaces/file.contract";
import { Subject } from "rxjs";
import { FormValueControl } from "@angular/forms/signals";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: "app-input-file",
  encapsulation: ViewEncapsulation.Emulated,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, MatInputModule],
  host: {
    "[class.floating]": "shouldLabelFloat()",
  },
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: InputImageComponent,
    },
  ],
  styles: [
    `
      mat-label {
        background: white;
        padding: 0 5px;
      }

      .container {
        height: 200px;
      }

      .mat-mdc-text-field-wrapper {
        padding: 0;
      }
      .cover {
        width: 100%;
        min-width: 100px;
        height: 200px;
        min-height: 200px;
        background-size: cover !important;
        background-position: center !important;
        opacity: 0.95;
        object-fit: cover;
      }
      li {
        list-style: none;
        position: absolute;
        bottom: 15px;
        right: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        background: rgba(0, 0, 0, 1);
      }
      button {
        color: white;
      }
    `,
  ],
  template: `
    <div class="container">
      <input
        type="file"
        style="display:none"
        #inputImage
        data-testid="file-input"
        (change)="changeInputFile($event)"
      />

      <div
        class="cover"
        [style.background]="
          value().url
            ? 'url(' + value().url + ')'
            : 'url(' + value().base64File + ')'
        "
      ></div>
      <li>
        <button
          type="button"
          mat-icon-button
          aria-label="Edit"
          matTooltip="Trocar foto"
          (click)="inputImage.click()"
        >
          <mat-icon>edit</mat-icon>
        </button>

        @if(value().name){

        <button
          mat-icon-button
          aria-label="Download"
          matTooltip="Baixar"
          type="button"
          (click)="downloadFile()"
        >
          <mat-icon>download</mat-icon>
        </button>
        <button
          mat-icon-button
          aria-label="Delete"
          matTooltip="Deletar"
          type="button"
          (click)="deleteFile()"
        >
          <mat-icon>delete</mat-icon>
        </button>
        }
      </li>
    </div>
  `,
})
export class InputImageComponent
  implements  FormValueControl<FileContract>
{
  value = model({
    base64File: "",
    url: "",
    name: "",
  } as FileContract);

  private _elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  stateChanges = new Subject<void>();

  public readonly placeholderInput = input<string>("", {
    alias: "placeholder",
  });
  public readonly disabledInput = input<boolean, BooleanInput>(false, {
    alias: "disabled",
    transform: (value) => coerceBooleanProperty(value),
  });
  public readonly userAriaDescribedByInput = input<string>("", {
    alias: "aria-describedby",
  });

  protected shouldLabelFloat(): boolean {
    return this.value().base64File !== "" || this.value().url !== "" ;
  }

  protected async changeInputFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const base64 = await FileUtil.fileToBase64(file);

    this.value.set( {
      base64File: base64,
      url: "",
      name: file.name,
    });
  }

  protected downloadFile() {
    if (this.value()?.base64File && this.value()?.name) {
      return FileUtil.base64FileDownload(
        this.value()?.base64File as string,
        this.value()?.name as string
      );
    }

    if (this.value()?.url && this.value()?.name) {
      return FileUtil.urlFileDownload(this.value()?.url as string, this.value()?.name as string);
    }
  }

  protected deleteFile() {
    this.value.set({
      base64File: "",
      url: "",
      name: "",
    });
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != "input") {
      const inputElement =
        this._elementRef.nativeElement.querySelector("input");
      if (inputElement) {
        inputElement.focus();
      }
    }
  }

  setDescribedByIds(ids: string[]) {
      const controlElement = this._elementRef.nativeElement
          .querySelector('input')!;
      controlElement.setAttribute('aria-describedby', ids.join(' '));
  }
}
