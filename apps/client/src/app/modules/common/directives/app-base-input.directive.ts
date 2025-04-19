import { Directive, HostBinding, Optional, Self } from "@angular/core";
import { NgControl, Validators } from "@angular/forms";
import { InputImageComponent } from "../components/app-input-file/app-input-file.component";

@Directive()
export class BaseInputDirective<T=any>{
    static nextId = 0;
    @HostBinding() id = `image-${InputImageComponent.nextId++}`;
    
    public value: T | null = null;
    public onTouched?: () => object;
    public onChange?: (value: T) => object;
    public isDisabled = false;
    public required = false;

    constructor(@Optional() @Self() public ngControl: NgControl ){
        if(ngControl){
            this.ngControl.valueAccessor = this;
            this.required = !ngControl.control?.hasValidator(Validators.required)
        }
    }

    public writeValue(obj:T): void {
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