import { Directive, inject } from "@angular/core";
import { NgControl, Validators } from "@angular/forms";
import { InputImageComponent } from "../components/app-input-file/app-input-file.component";

@Directive({})
export class BaseInputDirective<T = unknown> {
    static nextId = 0;
 
    public value: T | null = null;
    public onTouched?: () => object;
    public onChange?: (value: T) => object;
    public isDisabled = false;
    public required = false;
    public readonly ngControl = inject(NgControl, { optional: true, self: true });

    public writeValue(obj: T): void {
        this.value = obj;
    }
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    public setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }
    
}