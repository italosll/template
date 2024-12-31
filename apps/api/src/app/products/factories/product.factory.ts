import { ProductContract } from "@template/interfaces";
import { CreateProductDTO } from "../dto/create-product.dto";
import { FullProductDTO } from "../dto/full-product.dto";
import { UpdateProductDTO } from "../dto/update-product.dto";
import { AuditContract } from "../../common/contracts/audit.contract";
import { ProductWithCategoriesDTO } from "../dto/product-with-categories.dto";
import { bindAuditProperties } from "../utils/bind-audit-properties.util";

export class ProductFactory implements ProductContract, AuditContract{
  public id: number;
  public name: string;
  public code: string;
  public description: string;
  public image: {
    name: string;
    url: string;
  };

  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  public recoveredAt: Date;
  public categoryIds: number[];

  constructor(product?: Partial<ProductContract & AuditContract>) {
    this.id = product?.id ?? 1;
    this.name = product?.name ?? "Default Product Name";
    this.code = product?.code ?? "PRD123";
    this.description = product?.description ?? "Default product description";
    this.image = product?.image ?? { name: "default-image.jpg", url: "https://example.com/default-image.jpg" };
    // this.categoryIds = [1,2,3]
    bindAuditProperties(this, product);
  }


  createData = (params?) => new CreateProductDTO({...this, ...params});

  fullDataWithRelations = (params?) => new ProductWithCategoriesDTO({...this, ...params});

  updateData = (params?) => new UpdateProductDTO({...this, ...params});

  fullData = (params?) => new FullProductDTO({...this, params});
}
