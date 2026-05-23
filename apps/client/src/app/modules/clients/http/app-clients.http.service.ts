import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { getClientsRoutes } from "../app-index.routes";
import { ClientFormValue } from "../models/app-client.model";
import { throwError } from "rxjs";

type ClientPayload = {
  id?: number;
  personLegal?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    document?: string;
    companyRealName?: string;
  };
  personNatural?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    document?: string;
    birthDate?: string;
  };
};

@Injectable()
export class ClientsHttpService extends BaseHttpService<ClientPayload> {
  constructor() {
    super(getClientsRoutes().api.clients);
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
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber,
        document: body.document,
        birthDate: body.birthDate,
      },
    };
  }
}
