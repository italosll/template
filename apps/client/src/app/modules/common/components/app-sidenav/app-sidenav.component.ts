import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AccessService } from "@client/iam/services/app-access.service";
import { TemplateService } from "../templates/app.template.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "app-sidenav",
  providers: [TemplateService, AccessService],
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
  ],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        height: 100%;
      }

      a{
        justify-content: left;
        margin-top: 2px;
      }

      .active{
        background: var(--mat-sys-primary-container) !important;
      }
    `,
  ],
  template: `
    @for(navigationItem of navigationItems(); track navigationItem.path ){

    @if (navigationItem.visible && navigationItem.enabled) {
    <a
      mat-button
      routerLinkActive="active"
      [routerLink]="navigationItem.path"
    >
      <mat-icon>{{ navigationItem.icon }}</mat-icon>
      <span>
        {{ navigationItem.title }}
      </span>
    </a>
    }
    }

    <button
      type="button"
      mat-button
      aria-label="Sair"
      style="margin-top: auto"
      (click)="signOut()"
    >
      Sair
      <mat-icon>logout</mat-icon>
    </button>
  `,
})
export class SidenavComponent {
  private _templateServico = inject(TemplateService);
  private _accessService = inject(AccessService);

  protected navigationItems = computed(() =>
    this._templateServico.navigationItems()
  );

  protected signOut = () => {
    this._accessService.signOut().subscribe({
      next: (resp) => {},
      error: (error: HttpErrorResponse) => {},
    });
  };
}
