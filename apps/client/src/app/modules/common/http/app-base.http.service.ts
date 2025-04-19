import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";

 
export class BaseHttpService <T>{
    private httpClient = inject(HttpClient);

    constructor(public _url:string){}

public get = () => this.httpClient.get<T[]>(this._url,{
    responseType: 'json',
    withCredentials: true
});

    public post = (body:T) => this.httpClient.post<T>(this._url, body);

    public put = (body:T) => this.httpClient.put<T>(this._url, body);

    public delete = () => this.httpClient.delete<T>(this._url);    
}