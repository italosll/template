import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from "@angular/core";
import { TableComponent } from "@client/common/components/app-table/app-table.component";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "app-page-users",
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        TableComponent
    ],
    // styles:[`
    //     :host{
    //         display:block;
    //         height:100%;
    //     }`
    // ],
    template: `
    <div class="flex flex-col h-full bg-green-200 flex-center">
      Users


    <app-table [items]="items()"/>

    </div>`
})
export class PageUsersComponent {

  items = signal ([
    { id: 'one', status: 'complete', task: 'build' },
    { id: 'two', status: 'working', task: 'test' },
    { id: 'three', status: 'failed', task: 'deploy' },
  ])
    
}

