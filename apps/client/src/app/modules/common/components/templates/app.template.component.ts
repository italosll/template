import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { RouterModule } from "@angular/router";
import { SettingsDialogComponent } from "../app-settings-dialog/app-settings-dialog.component";
import { SidenavComponent } from "../app-sidenav/app-sidenav.component";
import { TemplateService } from "./app.template.service";
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TemplateService],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
    SidenavComponent,
  ],
  styles: [
    `
      nav {
        height: 64px;
        background-color: white;
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      mat-drawer {
        width: 250px;
      }

      mat-drawer-container {
        height: calc(100% - 64px);
      }

      mat-drawer-content {
        padding: 20px;
      }

      #logo {
        margin-left: 16px;
        height: 50px;
      }

      #settings {
        margin-left: auto;
        margin-right: 16px;
      }
    `,
  ],
  template: `
    <nav>
      <img
        id="logo"
        src="https://img.freepik.com/vetores-premium/um-logotipo-para-a-empresa-empresa-sobre-um-fundo-branco_1072857-23733.jpg?semt=ais_hybrid&w=740"
        alt="Logo"
      />
      <span> My Company</span>

      <button
        id="settings"
        mat-icon-button
        aria-label="Settings"
        (click)="openSettingsDialog()"
      >
        <mat-icon>settings</mat-icon>
      </button>
    </nav>
    <mat-divider></mat-divider>
    <mat-drawer-container>
      <mat-drawer mode="side" opened="true">
        <app-sidenav />
      </mat-drawer>
      <mat-drawer-content>
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
})
export class TemplateComponent {
  private _matDialog = inject(MatDialog);

  protected openSettingsDialog() {
    this._matDialog.open(SettingsDialogComponent);
  }
}
