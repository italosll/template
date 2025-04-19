import { Type } from "@angular/core";
import { CustomRibbonItemContract, RibbonItemContract } from "../contracts/ribbon.contract";

export class  RibbonItemModel implements RibbonItemContract {
    public title: string;
    public icon: string;
    public permissionName?: string;
    public enabled: boolean;
    public click?: () => (unknown | Promise<unknown>);

    constructor(
        title: string,
        icon: string,
        permissionName?: string,
        click?: () => (unknown | Promise<unknown>),
        enabled = true,
    ){
        this.title = title;
        this.icon = icon;
        this.permissionName = permissionName;
        this.enabled = enabled;
        this.click = click;
    }
}


export class CustomRibbonItemModel extends RibbonItemModel implements CustomRibbonItemContract {
    public component: Type<any>;

    constructor(
        component: Type<any>,
        title: string,
        icon: string,
        permissionName?: string,
        click?: () => (unknown | Promise<unknown>),
        enabled = true,
    ){
        super(title, icon, permissionName, click, enabled);
        this.component = component;
    }
}