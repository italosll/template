import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from "@angular/core";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "app-page-start",
    encapsulation: ViewEncapsulation.None,
    imports: [
    ],
    template: `
    <div class="flex flex-col h-full bg-green-200 flex-center">
      Start
    </div>`
})
export class PageStartComponent {
    constructor(){
    }
 
        
}

