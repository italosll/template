import { ProductContract } from "@template/interfaces";
import { CreateProductDTO } from "../dto/create-product.dto";
import { FullProductDTO } from "../dto/full-product.dto";
import { UpdateProductDTO } from "../dto/update-product.dto";

export class ProductFactory {
  public id: number;
  public name: string;
  public code: string;
  public description: string;
  public image: {
    name: string;
    url: string;
  };

  constructor(product?: Partial<ProductContract>) {
    this.id = product?.id ?? 1;
    this.name = product?.name ?? "Default Product Name";
    this.code = product?.code ?? "PRD123";
    this.description = product?.description ?? "Default product description";
    this.image = product?.image ?? { name: "default-image.jpg", url: "https://example.com/default-image.jpg" };
  }

  createProduct = () => new CreateProductDTO(this);

  updateProduct = () => new UpdateProductDTO(this);

  fullProduct = () => new FullProductDTO(this);
}
