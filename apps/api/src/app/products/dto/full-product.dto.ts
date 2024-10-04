import { ProductContract } from "@template/interfaces"

export class FullProductDTO implements ProductContract{

  public id: number
  public name: string
  public code: string
  public description: string
  public image:{
    name:string;
    url:string;
  };

  constructor (fullProductDTO:FullProductDTO){
    this.id= fullProductDTO?.id;
    this.name= fullProductDTO?.name;
    this.code= fullProductDTO?.code;
    this.description= fullProductDTO?.description;
    this.image= fullProductDTO?.image;
  }
}
