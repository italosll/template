import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle } from "@angular/material/dialog";
@Component({
    selector: "app-dialog",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone:true,
    imports:[
        MatDialogModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule
    ],
    template:`
        <h2 mat-dialog-title>Hi data.name</h2>
        <mat-dialog-content>
        <p>What's your favorite animal?</p>
        <!-- <mat-form-field>
            <mat-label>Favorite Animal</mat-label>
            <input matInput [(ngModel)]="animal" />
        </mat-form-field> -->
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-button>No Thanks</button>
            <button mat-button cdkFocusInitial>Ok</button>
        </mat-dialog-actions>
    `
})
export class DialogComponent{
// a = inject(DialogRef)

}