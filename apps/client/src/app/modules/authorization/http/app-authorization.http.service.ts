import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { AssignPermissionContract } from "@interfaces/assign-permission.contract";
import { AssignRoleContract } from "@interfaces/assign-role.contract";
import { CreateDefaultResponseDTO } from "@interfaces/create-default-response.dto";
import { UserPermissionAssignmentContract } from "@interfaces/user-permission-assignment.contract";
import { UserRoleAssignmentContract } from "@interfaces/user-role-assignment.contract";
import { Observable, tap } from "rxjs";
import { getAuthorizationRoutes } from "../app-index.routes";

@Injectable()
export class AuthorizationHttpService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _url = getAuthorizationRoutes().api.authorization;

  private readonly _loading = signal(false);
  public readonly loading = this._loading.asReadonly();

  assignRole(body: AssignRoleContract): Observable<CreateDefaultResponseDTO> {
    this._loading.set(true);
    return this._httpClient
      .post<CreateDefaultResponseDTO>(`${this._url}/roles`, body, {
        withCredentials: true,
      })
      .pipe(tap(() => this._loading.set(false)));
  }

  revokeRole(
    userId: number,
    roleId: number,
    tenantId?: number | null
  ): Observable<{ success: boolean }> {
    this._loading.set(true);
    const params = this._buildScopeParams(userId, roleId, "roleId", tenantId);
    return this._httpClient
      .delete<{ success: boolean }>(`${this._url}/roles`, {
        params,
        withCredentials: true,
      })
      .pipe(tap(() => this._loading.set(false)));
  }

  assignPermission(
    body: AssignPermissionContract
  ): Observable<CreateDefaultResponseDTO> {
    this._loading.set(true);
    return this._httpClient
      .post<CreateDefaultResponseDTO>(`${this._url}/permissions`, body, {
        withCredentials: true,
      })
      .pipe(tap(() => this._loading.set(false)));
  }

  revokePermission(
    userId: number,
    permissionId: number,
    tenantId?: number | null
  ): Observable<{ success: boolean }> {
    this._loading.set(true);
    const params = this._buildScopeParams(
      userId,
      permissionId,
      "permissionId",
      tenantId
    );
    return this._httpClient
      .delete<{ success: boolean }>(`${this._url}/permissions`, {
        params,
        withCredentials: true,
      })
      .pipe(tap(() => this._loading.set(false)));
  }

  listUserRoleAssignments(
    userId: number
  ): Observable<UserRoleAssignmentContract[]> {
    this._loading.set(true);
    return this._httpClient
      .get<UserRoleAssignmentContract[]>(
        `${this._url}/users/${userId}/roles`,
        { withCredentials: true }
      )
      .pipe(tap(() => this._loading.set(false)));
  }

  listUserPermissionAssignments(
    userId: number
  ): Observable<UserPermissionAssignmentContract[]> {
    this._loading.set(true);
    return this._httpClient
      .get<UserPermissionAssignmentContract[]>(
        `${this._url}/users/${userId}/permissions`,
        { withCredentials: true }
      )
      .pipe(tap(() => this._loading.set(false)));
  }

  getEffectivePermissions(
    userId: number,
    tenantId: number
  ): Observable<{ permissions: string[] }> {
    this._loading.set(true);
    return this._httpClient
      .get<{ permissions: string[] }>(
        `${this._url}/users/${userId}/effective`,
        {
          params: { tenantId },
          withCredentials: true,
        }
      )
      .pipe(tap(() => this._loading.set(false)));
  }

  private _buildScopeParams(
    userId: number,
    entityId: number,
    entityKey: "roleId" | "permissionId",
    tenantId?: number | null
  ): Record<string, string | number> {
    const params: Record<string, string | number> = {
      userId,
      [entityKey]: entityId,
    };
    if (tenantId !== undefined && tenantId !== null) {
      params["tenantId"] = tenantId;
    }
    return params;
  }
}
