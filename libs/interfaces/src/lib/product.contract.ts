export interface ProductContract{
  id:number;
  name:string;
  code:string;
  description:string;
  amount:number;
  cost:number;
  sellingPrice:number;
  maxDiscountPercentage:number;
  categoryIds?:number[];
  image:{
    base64File?:string;
    name?:string;
    url?:string;
  }
}
