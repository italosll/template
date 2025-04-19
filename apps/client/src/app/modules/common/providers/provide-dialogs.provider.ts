import { InjectionToken } from "@angular/core";
import { ComponentType } from "@angular/cdk/portal";


export interface DialogsContract{
    component: ComponentType<unknown>;
    keys: string[]
}[];

export const DialogsToken = new InjectionToken<DialogsContract[]>('DialogsContractToken'); 
export function provideDialogs(
    dialogs:DialogsContract[],
){
    return{
        provide: DialogsToken,
        useValue: dialogs
    }
}
