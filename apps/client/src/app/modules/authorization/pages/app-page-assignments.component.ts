import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  computed,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { RibbonCategoryItemComponent } from "@client/common/components/app-ribbon/app-ribbon-category-item.component";
import { RibbonComponent } from "@client/common/components/app-ribbon/app-ribbon.component";
import { REFRESH_DATA } from "@client/common/constants/refresh-data.constant";
import { RibbonCategoryContract } from "@client/common/contracts/ribbon.contract";
import { CustomRibbonItemModel } from "@client/common/model/app-ribbon-item.model";
import { UsersHttpService } from "@client/users/http/app-users.http.service";
import { UserPermissionAssignmentContract } from "@interfaces/user-permission-assignment.contract";
import { UserRoleAssignmentContract } from "@interfaces/user-role-assignment.contract";
import { UserContract } from "@interfaces/user.contract";
import { forkJoin } from "rxjs";
import { AuthorizationHttpService } from "../http/app-authorization.http.service";
import { DialogAssignPermissionComponent } from "./app-page-assign-permission-dialog.component";
import { DialogAssignRoleComponent } from "./app-page-assign-role-dialog.component";

@Component({
  selector: "app-page-assignments",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RibbonComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .section h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .chip {
        background: color-mix(in srgb, currentColor 8%, transparent);
        border-radius: 999px;
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
      }
    `,
  ],
  template: `
    <app-ribbon [categories]="categories" />

    <mat-form-field appearance="outline" style="max-width: 360px">
      <mat-label>Usuario</mat-label>
      <mat-select
        [value]="selectedUserId()"
        (selectionChange)="onUserChange($event.value)"
      >
        @for (user of users(); track user.id) {
          <mat-option [value]="user.id">
            {{ user.email || ("Usuario #" + user.id) }}
          </mat-option>
        }
      </mat-select>
    </mat-form-field>

    @if (loading()) {
      <mat-spinner diameter="40"></mat-spinner>
    }

    @if (selectedUserId()) {
      <div class="section">
        <h3>Cargos atribuidos</h3>
        <table mat-table [dataSource]="roleAssignments()" class="mat-elevation-z1">
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Cargo</th>
            <td mat-cell *matCellDef="let row">
              {{ row.role?.name || row.roleId }}
            </td>
          </ng-container>
          <ng-container matColumnDef="scope">
            <th mat-header-cell *matHeaderCellDef>Escopo</th>
            <td mat-cell *matCellDef="let row">
              {{ row.tenantId == null ? "Global" : ("Tenant #" + row.tenantId) }}
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let row">
              <button mat-button color="warn" (click)="revokeRole(row)">
                Remover
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="roleColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: roleColumns"></tr>
        </table>
      </div>

      <div class="section">
        <h3>Permissoes diretas</h3>
        <table
          mat-table
          [dataSource]="permissionAssignments()"
          class="mat-elevation-z1"
        >
          <ng-container matColumnDef="permission">
            <th mat-header-cell *matHeaderCellDef>Permissao</th>
            <td mat-cell *matCellDef="let row">
              {{ row.permission?.code || row.permissionId }}
            </td>
          </ng-container>
          <ng-container matColumnDef="scope">
            <th mat-header-cell *matHeaderCellDef>Escopo</th>
            <td mat-cell *matCellDef="let row">
              {{ row.tenantId == null ? "Global" : ("Tenant #" + row.tenantId) }}
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let row">
              <button mat-button color="warn" (click)="revokePermission(row)">
                Remover
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="permissionColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: permissionColumns"></tr>
        </table>
      </div>

      <div class="section">
        <h3>Permissoes efetivas</h3>
        @if (effectiveTenantId() !== null) {
          <div class="chips">
            @for (code of effectivePermissions(); track code) {
              <span class="chip">{{ code }}</span>
            } @empty {
              <span>Nenhuma permissao efetiva neste tenant.</span>
            }
          </div>
        } @else {
          <span>Informe um tenantId nas atribuicoes de tenant para visualizar.</span>
        }
      </div>
    }
  `,
})
export class AssignmentsPageComponent {
  private readonly _authorizationHttp = inject(AuthorizationHttpService);
  private readonly _usersHttp = inject(UsersHttpService);
  private readonly _dialog = inject(MatDialog);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _injector = inject(Injector);

  protected readonly users = signal<UserContract[]>([]);
  protected readonly selectedUserId = signal<number | null>(null);
  protected readonly roleAssignments = signal<UserRoleAssignmentContract[]>([]);
  protected readonly permissionAssignments = signal<
    UserPermissionAssignmentContract[]
  >([]);
  protected readonly effectivePermissions = signal<string[]>([]);
  protected readonly loading = this._authorizationHttp.loading;

  protected readonly roleColumns = ["role", "scope", "actions"];
  protected readonly permissionColumns = ["permission", "scope", "actions"];

  protected readonly effectiveTenantId = computed(() => {
    const tenantScoped = this.roleAssignments()
      .concat(
        this.permissionAssignments().map((item) => ({
          tenantId: item.tenantId,
        })) as UserRoleAssignmentContract[]
      )
      .find((item) => item.tenantId != null);
    return tenantScoped?.tenantId ?? null;
  });

  protected readonly categories: RibbonCategoryContract[] = [
    {
      title: "Atribuicoes",
      icon: "badge",
      items: [
        new CustomRibbonItemModel(
          RibbonCategoryItemComponent,
          "Atribuir cargo",
          "person_add",
          "authorization_assign_role",
          async () => this.openAssignRoleDialog(),
          true
        ),
        new CustomRibbonItemModel(
          RibbonCategoryItemComponent,
          "Atribuir permissao",
          "key",
          "authorization_assign_permission",
          async () => this.openAssignPermissionDialog(),
          true
        ),
      ],
    },
  ];

  constructor() {
    this._usersHttp
      .findAll()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((users) => this.users.set(users));

    this._dialog.afterOpened
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((dialog) => {
        dialog
          .afterClosed()
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe((response) => {
            if ((response as typeof REFRESH_DATA)?.refresh) {
              this.reloadAssignments();
            }
          });
      });
  }

  protected onUserChange(userId: number) {
    this.selectedUserId.set(userId);
    this.reloadAssignments();
  }

  protected openAssignRoleDialog() {
    this._dialog.open(DialogAssignRoleComponent, {
      width: "720px",
      maxWidth: "95vw",
      injector: this._injector,
    });
  }

  protected openAssignPermissionDialog() {
    this._dialog.open(DialogAssignPermissionComponent, {
      width: "720px",
      maxWidth: "95vw",
      injector: this._injector,
    });
  }

  protected revokeRole(row: UserRoleAssignmentContract) {
    this._authorizationHttp
      .revokeRole(row.userId, row.roleId, row.tenantId)
      .subscribe({
        next: () => {
          this._snackBar.open("Cargo removido", undefined, { duration: 3000 });
          this.reloadAssignments();
        },
      });
  }

  protected revokePermission(row: UserPermissionAssignmentContract) {
    this._authorizationHttp
      .revokePermission(row.userId, row.permissionId, row.tenantId)
      .subscribe({
        next: () => {
          this._snackBar.open("Permissao removida", undefined, {
            duration: 3000,
          });
          this.reloadAssignments();
        },
      });
  }

  private reloadAssignments() {
    const userId = this.selectedUserId();
    if (!userId) {
      return;
    }

    forkJoin({
      roles: this._authorizationHttp.listUserRoleAssignments(userId),
      permissions:
        this._authorizationHttp.listUserPermissionAssignments(userId),
    }).subscribe(({ roles, permissions }) => {
      this.roleAssignments.set(roles);
      this.permissionAssignments.set(permissions);

      const tenantId =
        roles.find((item) => item.tenantId != null)?.tenantId ??
        permissions.find((item) => item.tenantId != null)?.tenantId;

      if (tenantId != null) {
        this._authorizationHttp
          .getEffectivePermissions(userId, tenantId)
          .subscribe((response) =>
            this.effectivePermissions.set(response.permissions)
          );
      } else {
        this.effectivePermissions.set([]);
      }
    });
  }
}
