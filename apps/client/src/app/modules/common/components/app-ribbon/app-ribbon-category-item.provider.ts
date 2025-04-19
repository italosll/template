import { InjectionToken } from "@angular/core";
import { RibbonItemContract } from "@client/common/contracts/ribbon.contract";

export const RibbonItemDataToken = new InjectionToken<RibbonItemContract>('RibbonItemContractToken');

export function provideRibbonItem(item:RibbonItemContract){
    return [{
        provide: RibbonItemDataToken,
        useValue: item
    }]
}