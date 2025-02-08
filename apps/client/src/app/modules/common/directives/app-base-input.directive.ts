import { Directive, ElementRef, input, Optional, Self, viewChild } from "@angular/core";
import { NgControl, Validators } from "@angular/forms";

@Directive()
export class BaseInputDirective{

    private _inputHtmlElement = viewChild<ElementRef<HTMLInputElement>>("inputRef");
    private _labelHtmlElement = viewChild<ElementRef<HTMLLabelElement>>("labelRef");
    
    public label = input.required<string>();
    
    protected id = 'id-' + Math.random().toString(36).slice(0,9);
    protected value: string | number = "";
    protected onTouched?: () => object;
    protected onChange?: (value: string |number) => object;
    protected isDisabled = false;
    protected required = false;

    constructor(@Optional() @Self() public ngControl: NgControl ){
        if(ngControl){
            this.ngControl.valueAccessor = this;
            this.required = !ngControl.control?.hasValidator(Validators.required)
        }
    }

    public ngAfterViewInit(){
        this._inputHtmlElement()?.nativeElement?.addEventListener("focus", ()=>{
            this._labelHtmlElement()?.nativeElement?.classList.add("float_label");
        }) 

        this._inputHtmlElement()?.nativeElement?.addEventListener("blur", ()=>{

            const value = this._inputHtmlElement()?.nativeElement.value;
            if(!value){
                this._labelHtmlElement()?.nativeElement?.classList.remove("float_label");
            }
        })


        if(this.value){
            this._labelHtmlElement()?.nativeElement?.classList.add("float_label");
        }
    }
    
    
    public writeValue(obj: string|number): void {
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