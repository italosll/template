import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { InputTextComponent } from "@client/common/components/app-input-text.component";

@Component({
    changeDetection:ChangeDetectionStrategy.OnPush,
    standalone:true,
    encapsulation:ViewEncapsulation.None,
    imports:[
        InputTextComponent
    ],
    template:`
    <div class="w-[100lvw]  h-[100lvh] bg-wave-pattern flex-center">
        <div class="bg-white shadow-md rounded-lg w-96 p-2">
            <h1 class="title">Login</h1>
            <app-input-text label="email"/>
            <app-input-text label="password"/>
            <button class="button-primary w-full mt-4">Login</button>
        </div>
    </div>`    
})
export class LoginComponent {
    
}

