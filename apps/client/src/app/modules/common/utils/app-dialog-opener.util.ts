import { inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";


interface OpenDialogContract{
    key:string, value?:object | null
}
export class DialogOpenerUtil{

    private readonly _router = inject(Router)
    private readonly _activatedRoute = inject(ActivatedRoute)

    private  _openDialog(params:OpenDialogContract[]):Promise<boolean>{

        const queryParams = Object.fromEntries(params.map((param)=>{
            const formatedValue = param.value ? JSON.stringify(param.value) : true;
            return [param.key, formatedValue];
        }));

        return this._router.navigate([],{
                relativeTo: this._activatedRoute,
                queryParamsHandling: 'merge',
                queryParams
            });
    }

    public async openCreateDialog():Promise<boolean>{
       return this._openDialog([{
           key: 'cadastrar',
       }]);
    }

    public async openUpdateDialog():Promise<boolean>{
        return this._openDialog([{
            key: 'editar',
        }]);
    }

}