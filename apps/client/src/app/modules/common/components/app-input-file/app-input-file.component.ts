import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ControlValueAccessor, FormBuilder, FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldControl } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FileUtil } from "@client/common/utils/app-file.util";
import { FileContract } from "@interfaces/file.contract";
import { Subject } from "rxjs";
import { BaseInputDirective } from "../../directives/app-base-input.directive";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: "app-input-file",
  encapsulation: ViewEncapsulation.Emulated,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
  ],
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
        // background: red;
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
        // border-radius: 5px;
        //background: green;

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
        // border-radius: 5px;
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
        (change)="changeInputFile($event)"
      />

      <div
        class="cover"
        [style.background]="
          value?.url
            ? 'url(' + value?.url + ')'
            : 'url(' + value?.base64File + ')'
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

        @if(value?.name){

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
  extends BaseInputDirective<FileContract>
  implements MatFormFieldControl<FileContract>, ControlValueAccessor, OnDestroy
{
  disableAutomaticLabeling?: boolean | undefined;
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _inputImage = viewChild<ElementRef<HTMLInputElement>>("inputImage");

  controlType?: string | undefined = "app-input-image";

  private _formBuilder = inject(FormBuilder);
  private _elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  stateChanges = new Subject<void>();

  private _placeholder = "";

  touched = false;
  focused = false;

  private _disabled = false;

  autofilled?: boolean | undefined;

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  get empty() {
    // let n = this.parts.value;
    // return !n.area && !n.exchange && !n.subscriber;
    return true;
  }

  @HostBinding("class.floating")
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    // this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  get errorState(): boolean {
    // return this.parts.invalid && this.touched;
    return false;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input("aria-describedby") userAriaDescribedBy!: string;

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  protected async changeInputFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const base64 = await FileUtil.fileToBase64(file);

    this.value = {
      base64File: base64,
      url: null,
      name: file.name,
    };

    if (this.onChange) this.onChange(this.value);
    this._changeDetectorRef.markForCheck();
  }

  public override writeValue(obj: object): void {
    this.value = obj;
    this._changeDetectorRef.markForCheck();
  }

  protected downloadFile() {
    if (this.value?.base64File && this.value?.name) {
      return FileUtil.base64FileDownload(
        this.value.base64File,
        this.value.name
      );
    }

    if (this.value?.url && this.value?.name) {
      return FileUtil.urlFileDownload(this.value.url, this.value.name);
    }
  }

  protected deleteFile() {
    this.value = {
      base64File: null,
      url: null,
      name: null,
    };
    if (this.onChange) this.onChange(this.value);
    this._changeDetectorRef.markForCheck();
  }

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (
      !this._elementRef.nativeElement.contains(event.relatedTarget as Element)
    ) {
      this.touched = true;
      this.focused = false;
      if (this.onTouched) this.onTouched();
      this.stateChanges.next();
    }
  }

  setDescribedByIds(ids: string[]) {
    // const controlElement = this._elementRef.nativeElement
    //     .querySelector('.app-input-image')!;
    // controlElement.setAttribute('aria-describedby', ids.join(' '));
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
}
