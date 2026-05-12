import { HttpClient } from "@angular/common/http";
import { inject, Signal, signal, WritableSignal } from "@angular/core";
import { objectToQueryParams } from "../utils/app-object-to-query-params";
import { map, Observable, tap } from "rxjs";


export class BaseHttpService <T>{
    private readonly _httpClient = inject(HttpClient);
    private readonly _loadingFind = signal(false);
    private readonly _loadingSave = signal(false);
    private readonly _loadingDelete = signal(false);

    public readonly loadingFind = this._loadingFind.asReadonly()
    public readonly loadingSave = this._loadingSave.asReadonly()
    public readonly loadingDelete = this._loadingDelete.asReadonly()

    constructor(public _url:string){}


    public findAll = (filters?:{[key:string]:unknown}) => {

        let fullUrl = this._url;

        if(filters){
            fullUrl += objectToQueryParams(filters);
        }

        this._loadingFind.set(true);
        return this._httpClient.get<T[]>(fullUrl,{
            responseType: 'json',
            withCredentials: true
        }).pipe(tap(()=> this._loadingFind.set(false)));
    }

    public findById = (id:number|string):Observable<T | undefined> => {

        const  fullUrl = `${this._url}?id=${id}`;

        this._loadingFind.set(true);
        return this._httpClient.get<T[]>(fullUrl,{
            responseType: 'json',
            withCredentials: true
        })?.pipe(map((data) => data?.at(0)), tap(()=> this._loadingFind.set(false)));
    }

  public findByText = (text:unknown):Observable<(T)[]> => {
    const  fullUrl = `${this._url}?pesquisar=${String(text)}`;
    this._loadingFind.set(true);
    return this._httpClient.get<T[]>(fullUrl,{
      responseType: 'json',
      withCredentials: true
    }).pipe(tap(()=> this._loadingFind.set(false)));
  }

    public create (body:T) {
      this._loadingSave.set(true);
      return this._httpClient.post<T>(this._url, body).pipe(tap(()=> this._loadingSave.set(false)))
    }

    public update(body:T){
      this._loadingSave.set(true);
      return this._httpClient.put<T>(this._url, body).pipe(tap(()=> this._loadingSave.set(false)));
    }

    public delete(ids:number[]){
      this._loadingDelete.set(true);
      return this._httpClient.delete<T>(`${this._url}?ids=${ids}`).pipe(tap(()=> this._loadingDelete.set(false)));
    }
}
