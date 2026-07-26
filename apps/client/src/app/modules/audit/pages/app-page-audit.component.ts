import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import { PermissionsService } from "@client/common/services/app-permissions.service";
import {
  AuditLogContract,
  QueryAuditContract,
} from "@interfaces/audit-log.contract";
import { AuditHttpService } from "../http/app-audit.http.service";

type AuditFilterForm = {
  userId: string;
  resourceType: string;
  resourceId: string;
  action: string;
  statusCode: string;
  from: string;
  to: string;
};

@Component({
  selector: "app-page-audit",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatTableModule,
  ],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .filters {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 0.75rem 1rem;
        align-items: start;
      }

      .actions {
        display: flex;
        gap: 0.75rem;
        grid-column: 1 / -1;
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 1rem;
        font-size: 0.875rem;
        opacity: 0.8;
      }

      .empty {
        padding: 1.5rem 0;
        opacity: 0.7;
      }

      pre {
        margin: 0;
        max-width: 280px;
        white-space: pre-wrap;
        word-break: break-word;
        font-size: 0.75rem;
      }
    `,
  ],
  template: `
    <h2>Auditoria</h2>

    <div class="meta">
      <span>Tenant #{{ tenantId() ?? "—" }}</span>
      <span>{{ items().length }} evento(s)</span>
    </div>

    <form class="filters" (ngSubmit)="search()">
      <mat-form-field>
        <mat-label>Usuario (ID)</mat-label>
        <input matInput name="userId" [(ngModel)]="filters.userId" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Recurso</mat-label>
        <input
          matInput
          name="resourceType"
          [(ngModel)]="filters.resourceType"
          placeholder="products"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>ID do recurso</mat-label>
        <input matInput name="resourceId" [(ngModel)]="filters.resourceId" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Acao</mat-label>
        <input
          matInput
          name="action"
          [(ngModel)]="filters.action"
          placeholder="POST /products"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Status HTTP</mat-label>
        <input matInput name="statusCode" [(ngModel)]="filters.statusCode" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>De</mat-label>
        <input
          matInput
          type="datetime-local"
          name="from"
          [(ngModel)]="filters.from"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Ate</mat-label>
        <input
          matInput
          type="datetime-local"
          name="to"
          [(ngModel)]="filters.to"
        />
      </mat-form-field>

      <div class="actions">
        <button mat-flat-button color="primary" type="submit">Filtrar</button>
        <button mat-stroked-button type="button" (click)="clearFilters()">
          Limpar
        </button>
      </div>
    </form>

    @if (loading()) {
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    }

    @if (!loading() && items().length === 0) {
      <p class="empty">Nenhum evento de auditoria encontrado.</p>
    }

    @if (items().length > 0) {
      <div class="overflow-x-auto">
        <table mat-table [dataSource]="items()">
          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Data</th>
            <td mat-cell *matCellDef="let row">
              {{ formatDate(row.createdAt) }}
            </td>
          </ng-container>

          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef>Acao</th>
            <td mat-cell *matCellDef="let row">{{ row.action }}</td>
          </ng-container>

          <ng-container matColumnDef="resource">
            <th mat-header-cell *matHeaderCellDef>Recurso</th>
            <td mat-cell *matCellDef="let row">
              {{ formatResource(row) }}
            </td>
          </ng-container>

          <ng-container matColumnDef="userId">
            <th mat-header-cell *matHeaderCellDef>Usuario</th>
            <td mat-cell *matCellDef="let row">{{ row.userId ?? "—" }}</td>
          </ng-container>

          <ng-container matColumnDef="statusCode">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">{{ row.statusCode }}</td>
          </ng-container>

          <ng-container matColumnDef="executionTimeMs">
            <th mat-header-cell *matHeaderCellDef>Tempo (ms)</th>
            <td mat-cell *matCellDef="let row">{{ row.executionTimeMs }}</td>
          </ng-container>

          <ng-container matColumnDef="ipAddress">
            <th mat-header-cell *matHeaderCellDef>IP</th>
            <td mat-cell *matCellDef="let row">{{ row.ipAddress ?? "—" }}</td>
          </ng-container>

          <ng-container matColumnDef="isSuperUser">
            <th mat-header-cell *matHeaderCellDef>Super</th>
            <td mat-cell *matCellDef="let row">
              {{ row.isSuperUser ? "Sim" : "Nao" }}
            </td>
          </ng-container>

          <ng-container matColumnDef="metadata">
            <th mat-header-cell *matHeaderCellDef>Metadata</th>
            <td mat-cell *matCellDef="let row">
              @if (row.metadata) {
                <pre>{{ formatMetadata(row.metadata) }}</pre>
              } @else {
                —
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
    }
  `,
})
export class AuditPageComponent {
  private readonly _auditHttp = inject(AuditHttpService);
  private readonly _permissions = inject(PermissionsService);

  protected readonly tenantId = this._permissions.tenantId;
  protected readonly items = signal<AuditLogContract[]>([]);
  protected readonly loading = this._auditHttp.loadingFind;

  protected readonly displayedColumns = [
    "createdAt",
    "action",
    "resource",
    "userId",
    "statusCode",
    "executionTimeMs",
    "ipAddress",
    "isSuperUser",
    "metadata",
  ];

  protected filters: AuditFilterForm = this._emptyFilters();

  constructor() {
    this.search();
  }

  protected search(): void {
    const query = this._buildQuery();
    this._auditHttp.findByFilters(query).subscribe({
      next: (rows) => this.items.set(rows),
      error: () => this.items.set([]),
    });
  }

  protected clearFilters(): void {
    this.filters = this._emptyFilters();
    this.search();
  }

  protected formatDate(value: string | Date): string {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }
    return date.toLocaleString();
  }

  protected formatResource(row: AuditLogContract): string {
    if (!row.resourceType && !row.resourceId) {
      return "—";
    }
    if (row.resourceType && row.resourceId) {
      return `${row.resourceType} #${row.resourceId}`;
    }
    return row.resourceType || row.resourceId || "—";
  }

  protected formatMetadata(metadata: Record<string, unknown>): string {
    try {
      return JSON.stringify(metadata, null, 2);
    } catch {
      return String(metadata);
    }
  }

  private _emptyFilters(): AuditFilterForm {
    return {
      userId: "",
      resourceType: "",
      resourceId: "",
      action: "",
      statusCode: "",
      from: "",
      to: "",
    };
  }

  private _buildQuery(): QueryAuditContract {
    const query: QueryAuditContract = {
      tenantId: this.tenantId() ?? undefined,
      limit: 50,
      page: 1,
    };

    const userId = Number(this.filters.userId);
    if (this.filters.userId.trim() && !Number.isNaN(userId)) {
      query.userId = userId;
    }

    if (this.filters.resourceType.trim()) {
      query.resourceType = this.filters.resourceType.trim();
    }

    if (this.filters.resourceId.trim()) {
      query.resourceId = this.filters.resourceId.trim();
    }

    if (this.filters.action.trim()) {
      query.action = this.filters.action.trim();
    }

    const statusCode = Number(this.filters.statusCode);
    if (this.filters.statusCode.trim() && !Number.isNaN(statusCode)) {
      query.statusCode = statusCode;
    }

    if (this.filters.from) {
      query.from = new Date(this.filters.from).toISOString();
    }

    if (this.filters.to) {
      query.to = new Date(this.filters.to).toISOString();
    }

    return query;
  }
}
