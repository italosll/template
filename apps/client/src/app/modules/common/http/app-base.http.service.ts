import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { objectToQueryParams } from "../utils/app-object-to-query-params";
import { map, Observable } from "rxjs";

 
export class BaseHttpService <T>{
    private httpClient = inject(HttpClient);

    constructor(public _url:string){}

    public findAll = (filters?:{[key:string]:unknown}) => {
        
        let fullUrl = this._url;

        if(filters){
            fullUrl += objectToQueryParams(filters);
        }
        
        return this.httpClient.get<T[]>(fullUrl,{
            responseType: 'json',
            withCredentials: true
        });
    }
    
    public findById = (id:number|string):Observable<T | undefined> => {
        
        const  fullUrl = `${this._url}?id=${id}`;
 
        return this.httpClient.get<T[]>(fullUrl,{
            responseType: 'json',
            withCredentials: true
        })?.pipe(map((data) => data?.at(0) ));
    }

    public create = (body:T) => this.httpClient.post<T>(this._url, body);

    public update = (body:T) => this.httpClient.put<T>(this._url, body);

    public delete = () => this.httpClient.delete<T>(this._url);    
}