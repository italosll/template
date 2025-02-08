import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, Component } from "@angular/core";
import { ControlValueAccessor, FormsModule } from "@angular/forms"
import { BaseInputDirective } from "../../directives/app-base-input.directive";

@Component({
    changeDetection:ChangeDetectionStrategy.OnPush,
    standalone:true,
    selector:"app-input-text",
    imports:[
        CommonModule,
        FormsModule
    ],
    styleUrl:"./app-input.component.scss",
    template:`
    <div class="input__container">
        <label #labelRef [for]="id" class="label">
            {{ label() }}

            @if(required){
                <span>*</span>
            }
        </label>
            <input 
                #inputRef 
                [id]="id"  
                [(ngModel)]="value"
                (focus)="onTouched && onTouched()" 
                (input)="onChange && onChange(value)" 
                [disabled]="isDisabled"
            />
    </div>
    <span>
        Este é um erro de validação
    </span>


    `,
})
export class InputTextComponent extends BaseInputDirective implements ControlValueAccessor, AfterViewInit{
    

}