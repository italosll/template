import { HttpClient } from "@angular/common/http";
import { inject, Signal, signal, WritableSignal } from "@angular/core";
import { objectToQueryParams } from "../utils/app-object-to-query-params";
import { map, Observable, tap } from "rxjs";
import { CreateDefaultResponseDTO } from "@interfaces/create-default-response.dto";
import { DeleteDefaultResponseDTO } from "@interfaces/delete-default-response.dto";
import { UpdateDefaultResponseDTO } from "@interfaces/update-default-response.dto";

export class BaseHttpService <
ResponseFindAll,
ResponseFindById,
RequestCreate,
RequestUpdate
>{
    protected readonly _httpClient = inject(HttpClient);
    protected readonly _loadingFind = signal(false);
    protected readonly _loadingSave = signal(false);
    protected readonly _loadingDelete = signal(false);

    public readonly loadingFind = this._loadingFind.asReadonly()
    public readonly loadingSave = this._loadingSave.asReadonly()
    public readonly loadingDelete = this._loadingDelete.asReadonly()

    constructor(public _url:string){}


    public findAll (filters?:{[key:string]:unknown}){

        let fullUrl = this._url;

        if(filters){
            fullUrl += objectToQueryParams(filters);
        }

        this._loadingFind.set(true);
        return this._httpClient.get<ResponseFindAll[]>(fullUrl,{
            responseType: 'json',
            withCredentials: true
        }).pipe(tap(()=> this._loadingFind.set(false)));
    }

    public findById(id:number|string):Observable<ResponseFindById>{

        const  fullUrl = `${this._url}?id=${id}`;

        this._loadingFind.set(true);
        return this._httpClient.get<ResponseFindById[]>(fullUrl,{
            responseType: 'json',
            withCredentials: true
        }).pipe(map(data=>  data?.at(0) as ResponseFindById), tap(()=> this._loadingFind.set(false)));
    }

  public findByText(text:unknown):Observable<(ResponseFindAll)[]> {
    const  fullUrl = `${this._url}?pesquisar=${String(text)}`;
    this._loadingFind.set(true);
    return this._httpClient.get<ResponseFindAll[]>(fullUrl,{
      responseType: 'json',
      withCredentials: true
    }).pipe(tap(()=> this._loadingFind.set(false)));
  }

    public create (body:RequestCreate) {
      this._loadingSave.set(true);
      return this._httpClient.post<CreateDefaultResponseDTO>(this._url, body).pipe(tap(()=> this._loadingSave.set(false)))
    }

    public update(body:RequestUpdate) {
      this._loadingSave.set(true);
      return this._httpClient.put<UpdateDefaultResponseDTO>(this._url, body).pipe(tap(()=> this._loadingSave.set(false)));
    }

    public delete(ids:number[]){
      this._loadingDelete.set(true);
      return this._httpClient.delete<DeleteDefaultResponseDTO >(`${this._url}?ids=${ids}`).pipe(tap(()=> this._loadingDelete.set(false)));
    }
}
