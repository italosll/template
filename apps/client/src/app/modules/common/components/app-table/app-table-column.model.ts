export type TableColumnModelTypeContract = "id" | "image" | "date" | "string" | "money" | "numberFloat" | "numberInteger" | "dateTime" ;
export class  TableColumnModel {
    public title:string;
    public type: TableColumnModelTypeContract;
    public name:string;
    public visible:boolean;
    
    constructor(
         title:string,
         name:string,
         type: TableColumnModelTypeContract,
         visible = true,
    ){
       this.title = title;
       this.type = type;
       this.name = name;
       this.visible = visible;
    }
}
