import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { getClientsRoutes } from "../app-index.routes";
import { ClientFormValue } from "../models/app-client.model";
import { map, Observable, tap, throwError } from "rxjs";
import { ClientLookupContract } from "@interfaces/client-lookup.contract";
import { PersonContract, PersonLegalContract, PersonNaturalContract } from "@interfaces/person.contract";

type ClientPayload = {
  id?: number;
  personLegal?: {
    id?: number;
    name?: string;
    email?: string;
    phoneNumber?: string;
    document?: string;
    companyRealName?: string;
  };
  personNatural?: {
    id?: number;
    name?: string;
    email?: string;
    phoneNumber?: string;
    document?: string;
    birthDate?: string;
  };
};

@Injectable()
export class ClientsHttpService extends BaseHttpService<
  PersonContract & (PersonNaturalContract|PersonLegalContract)[],
  PersonContract & (PersonNaturalContract|PersonLegalContract),
  ClientPayload,
  ClientPayload
> {
  constructor() {
    super(getClientsRoutes().api.clients);
  }

  lookup(): Observable<ClientLookupContract[]> {
    const fullUrl = `${this._url}/lookup`;

    this._loadingFind.set(true);
    return this._httpClient
      .get<ClientLookupContract[]>(fullUrl, {
        responseType: "json",
        withCredentials: true,
      })
      .pipe(tap(() => this._loadingFind.set(false)));
  }

  override findById(id:number|string):Observable<PersonContract & (PersonNaturalContract|PersonLegalContract)> {

      const  fullUrl = `${this._url}?id=${id}`;

      this._loadingFind.set(true);
      return this._httpClient.get<PersonContract & (PersonNaturalContract|PersonLegalContract)[]>(fullUrl,{
          responseType: 'json',
          withCredentials: true
      })?.pipe(
        map((data) => data?.at(0) as PersonContract & (PersonNaturalContract|PersonLegalContract)),
        tap(()=> this._loadingFind.set(false))
      );
  }

  override create(body: ClientFormValue) {
    const payload = this._buildPayload(body);
    if (!payload) {
      return throwError(() => new Error("Informe pessoa fisica ou juridica."));
    }
    return super.create(payload);
  }

  override update(body: ClientFormValue) {
    const payload = this._buildPayload(body);
    if (!payload) {
      return throwError(() => new Error("Informe pessoa fisica ou juridica."));
    }
    payload.id = body.id;
    return super.update(payload);
  }

  private _buildPayload(body: ClientFormValue): ClientPayload | null {
    const hasLegal = !!body.companyRealName?.trim();
    const hasNatural = !!body.birthDate?.trim();

    if (hasLegal === hasNatural) {
      return null;
    }

    if (hasLegal) {
      return {
        personLegal: {
          id: body.id,
          name: body.name,
          email: body.email,
          phoneNumber: body.phoneNumber,
          document: body.document,
          companyRealName: body.companyRealName,
        },
      };
    }

    return {
      personNatural: {
        id: body.id,
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber,
        document: body.document,
        birthDate: body.birthDate,
      },
    };
  }
}
