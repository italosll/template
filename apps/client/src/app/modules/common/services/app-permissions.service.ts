import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { getAuthorizationRoutes } from "@client/authorization/app-index.routes";
import { SessionAuthorizationContract } from "@interfaces/session-authorization.contract";
import { Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _url = `${getAuthorizationRoutes().api.authorization}/me`;

  private readonly _session = signal<SessionAuthorizationContract | null>(null);
  private readonly _loaded = signal(false);

  readonly session = this._session.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly permissions = computed(() => this._session()?.permissions ?? []);
  readonly tenantId = computed(() => this._session()?.tenantId ?? null);
  readonly userId = computed(() => this._session()?.userId ?? null);

  load(force = false): Observable<SessionAuthorizationContract> {
    if (this._loaded() && !force && this._session()) {
      return of(this._session()!);
    }

    return this._httpClient
      .get<SessionAuthorizationContract>(this._url, {
        withCredentials: true,
      })
      .pipe(
        tap((session) => {
          this._session.set(session);
          this._loaded.set(true);
        })
      );
  }

  hasPermission(code: string): boolean {
    return this._session()?.permissions.includes(code) ?? false;
  }

  clear(): void {
    this._session.set(null);
    this._loaded.set(false);
  }
}
