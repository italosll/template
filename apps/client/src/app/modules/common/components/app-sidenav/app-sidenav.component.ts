import { CommonModule } from "@angular/common";
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
    CommonModule,
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

      a {
        // border-radius: 10px !important;
        display: flex;
        justify-content: flex-start;
        margin-top: 2px;
      }

      #logout {
        margin-top: auto;
      }
    `,
  ],
  template: `
    @for(navigationItem of navigationItems(); track navigationItem.path ){
    <a
      [style]="{
        color: navigationItem.active ? 'var(--primary-color)' : 'black',
         background: navigationItem.active ? 'var(--primary-color-light)' : 'white',
    }"
      mat-flat-button
      [routerLink]="navigationItem.path"
      routerLinkActive="active"
    >
      <mat-icon>{{ navigationItem.icon }}</mat-icon>
      <span>
        {{ navigationItem.title }}
      </span>
    </a>
    }

    <button
      type="button"
      mat-flat-button
      aria-label="Sair"
      id="logout"
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
      next: (resp) => {
        console.log("Usuário deslogado com sucesso");
        console.log(resp);
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao deslogar:", error);
      },
    });
  };
}
