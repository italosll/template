import { ProductContract } from "@template/interfaces";

export class UpdateProductDTO implements ProductContract{
  public id: number;
  public name: string;
  public code: string;
  public description: string;
  public image:{
    name:string;
    url:string;
  };

  constructor (updateProductDTO:UpdateProductDTO){
    this.id = updateProductDTO.id;
    this.name = updateProductDTO.name;
    this.code = updateProductDTO.code;
    this.description = updateProductDTO.description;
    this.image = updateProductDTO.image;
  }
}
