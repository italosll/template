export class  NavigationItemModel {
    public title:string;
    public path:string;
    public active:boolean;
    public visible:boolean;
    public enabled:boolean;

    constructor(
         title:string,
         path:string,
         active = true,
         visible = true,
         enabled = true,
    ){
       this.title = title;
       this.path = path;
       this.active = active;
       this.visible = visible;
       this.enabled = enabled;

    }
}
