import { Injectable, signal } from "@angular/core";

@Injectable()
export class DataSourceService<T> {
  private readonly _dataSource = signal<T[]>([]);
  public readonly dataSource = this._dataSource.asReadonly();

  public setData(data:T[]) {
    this._dataSource.set(data);
  }
}
