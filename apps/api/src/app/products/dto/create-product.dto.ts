import { ProductContract } from "@interfaces/product.contract";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDTO implements Omit<ProductContract, "id">{
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public code: string;

  @IsNotEmpty()
  @IsString()
  public description: string;

  @IsNotEmpty()
  @IsNumber()
  public amount:number;

  @IsNotEmpty()
  @IsNumber()
  public cost:number;

  @IsNotEmpty()
  @IsNumber()
  public sellingPrice:number;

  @IsNotEmpty()
  @IsNumber()
  public maxDiscountPercentage:number;

  public image:{
    base64file?:string|null;
    name?:string;
    url?:string;
  };

  @IsArray()
  public categoryIds: number[];
}
