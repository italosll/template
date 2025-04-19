import { CommonModule } from "@angular/common";
import {  ChangeDetectionStrategy, Component, Directive, input } from "@angular/core";
import {  FormsModule } from "@angular/forms"
import { MatTableModule } from "@angular/material/table";
import { TableColumnModelTypeContract } from "./app-table-column.model";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: "td[app-table-td]",
})
export class TableTdImageDirective{
    type= input<TableColumnModelTypeContract>("string");

    // columns = inject(DisplayedColumnsToken);

    // displayedColumns= this.columns.map((column)=> column.name)

    // ngAfterViewInit(){
    //   console.log("this.displayedColumns");
    //   console.log(this.items());
    // }
    
}