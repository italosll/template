import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, Component } from "@angular/core";
import { ControlValueAccessor, FormsModule } from "@angular/forms"
import { BaseInputDirective } from "../directives/app-base-input.directive";

@Component({
    changeDetection:ChangeDetectionStrategy.OnPush,
    standalone:true,
    selector:"app-input-text",
    imports:[
        CommonModule,
        FormsModule
    ],
    styles:[`
        :host{
            display:block;
            height:65px;
            padding-top:10px;
       
        }
        .float_label{
            background: white;
            transition: all 0.2s;
            transform: translate(0px, -15px);
        }
    `],
    template:`
    <div class="flex relative rounded-lg shadow-default">
        <label 
            #labelRef 
            [for]="id" 
            class="absolute pointer-events-none left-0 transition-all translate-y-[8px] ml-[10px]">
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
                class="outline-none h-[40px] bg-transparent w-full"
            />
    </div>
    <div class="text-xs">
        Este é um erro de validação
    </div>


    `,
})
export class InputTextComponent extends BaseInputDirective implements ControlValueAccessor, AfterViewInit{
    

}