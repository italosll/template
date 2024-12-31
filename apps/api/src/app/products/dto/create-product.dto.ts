import { ProductContract } from "@template/interfaces";

export class CreateProductDTO implements Omit<ProductContract, "id">{

  public name: string;
  public code: string;
  public description: string;
  public image:{
    name:string;
    url:string;
  };

  public categoryIds: number[];

  constructor (createProductDTO:CreateProductDTO ){
     this.name = createProductDTO.name;
     this.code = createProductDTO.code;
     this.description = createProductDTO.description;
     this.image = createProductDTO.image;
     this.categoryIds = createProductDTO.categoryIds;
  }
}
