import { inject, Injectable } from "@angular/core";
import { DialogsToken } from "../providers/provide-dialogs.provider";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable()
export class DialogsOpenerService {
    private readonly _dialogs = inject(DialogsToken);
    private readonly _activatedRoute = inject(ActivatedRoute);
    private readonly _matDialog = inject(MatDialog);
    private readonly _router = inject(Router)
    constructor(){
        this._activatedRoute.queryParams.subscribe((params)=>{

            this._dialogs.forEach((dialog)=>{
                const urlParams = Object.keys(params);
                const openDialog = dialog.keys.some((k)=>urlParams.includes(k));

                if(openDialog){
                    const queryParams: {[key:string]:null} = {};

                    dialog.keys.forEach((k)=>{
                        queryParams[k] = null;
                    });

                    this._matDialog.open(dialog.component).afterClosed().subscribe(()=>{ 
                        this._router.navigate([],{
                            relativeTo: this._activatedRoute,
                            queryParamsHandling: 'merge',
                            queryParams,
                        });
                    });
                }
            });
        });
    }
}