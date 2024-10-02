import { IProduct } from "@template/interfaces";

export class UpdateProductDTO implements IProduct{
  constructor (
    public id: number,
    public name: string,
    public code: string,
    public description: string,
    public amount: number,
    public cost: number,
    public sellingPrice: number,
    public maxDiscountPercentage: number,
    public imageURls: string[]
  ){}
}
