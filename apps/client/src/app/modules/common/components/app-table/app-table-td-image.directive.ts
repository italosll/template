import { Directive, input } from "@angular/core";
import { TableColumnModelTypeContract } from "./app-table-column.model";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "td[app-table-td]",
})
export class TableTdImageDirective {
  type = input<TableColumnModelTypeContract>("string");

  // columns = inject(DisplayedColumnsToken);

  // displayedColumns= this.columns.map((column)=> column.name)
}
