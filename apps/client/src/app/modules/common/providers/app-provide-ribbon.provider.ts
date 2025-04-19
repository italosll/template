import { RibbonCategoryContract } from '@client/common/contracts/ribbon.contract';
import { InjectionToken } from "@angular/core";

export const RibbonCategoriesContractToken = new InjectionToken<RibbonCategoryContract[]>('RibbonCategoryContractToken'); 
export function provideRibbon(
    categories:RibbonCategoryContract[],
){
    return{
        provide: RibbonCategoriesContractToken,
        useValue: categories
    }
}
