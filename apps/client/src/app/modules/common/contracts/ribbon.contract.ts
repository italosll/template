import { Type } from "@angular/core";

export interface RibbonItemContract{
    title: string;
    icon: string;
    permissionName?: string;
    enabled: boolean;
    click?: () => (unknown | Promise<unknown>);
}

export interface CustomRibbonItemContract extends RibbonItemContract{
    component: Type<any>
}

export interface RibbonCategoryContract{
    title: string;
    icon: string;
    items: RibbonItemContract []
}
