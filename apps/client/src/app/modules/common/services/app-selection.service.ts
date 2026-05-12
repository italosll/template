import { Injectable, signal, Signal, WritableSignal } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { map, startWith, tap } from "rxjs";

@Injectable()
export class SelectionService {

  private readonly _selection = new SelectionModel<any>(true, []);
  private readonly _items:WritableSignal<object[]> = signal([]);
  private readonly _selectedItems:WritableSignal<object[]> = signal([]);

  public readonly selectedItems = this._selectedItems.asReadonly();

  private syncSelectedItems(){
    this._selectedItems.set(this._selection.selected);
  }

  public isSelected(value:object) {
    return this._selection.isSelected(value)
  }

  public isAllSelected() {
    const numSelected = this._selection.selected.length;
    const numRows = this._items().length;
    return numSelected === numRows;
  }

  public toggle(value:object){
    this._selection.toggle(value)
    return this.syncSelectedItems();
  }

  public toggleAll() {
    if (this.isAllSelected()) {
      this._selection.clear();
      this.syncSelectedItems();
      return;
    }

    this._selection.select(...this._items());
    this.syncSelectedItems();
  }

  public hasValue(){
    return this._selection.hasValue( )
  }

  public setItems(items: object[]) {
    this._items.set(items);
    this.syncSelectedItems();
  }
}
