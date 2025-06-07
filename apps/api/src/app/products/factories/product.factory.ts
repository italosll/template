import { AuditContract } from "../../common/contracts/audit.contract";
import { FactoryContract } from "../../common/contracts/factory.contract";
import { CreateProductDTO } from "../dto/create-product.dto";
import { ResponseProductDTO } from "../dto/response-product.dto";
import { UpdateProductDTO } from "../dto/update-product.dto";

import { plainToInstance } from "class-transformer";

export class ProductFactory
  implements
    FactoryContract<CreateProductDTO, UpdateProductDTO, ResponseProductDTO>
{
  private _fakeData: Partial<
    CreateProductDTO | UpdateProductDTO | ResponseProductDTO
  > = {
    id: 1,
    code: "X1223G",
    description: "Descrição",
    image: {
      name: "motor_3243423.png",
      url: "www.url.com.br",
    },
    name: "nome",
    amount: 10,
    cost: 10,
    sellingPrice: 15,
    maxDiscountPercentage: 10,
    categoryIds: [1, 2, 3, 4],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    recoveredAt: new Date(),
  };

  public create(
    params?: Partial<CreateProductDTO & AuditContract> | null,
    setFakeData = false
  ) {
    return plainToInstance(
      CreateProductDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }

  public update(
    params?: Partial<UpdateProductDTO & AuditContract> | null,
    setFakeData = false
  ) {
    return plainToInstance(
      UpdateProductDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }

  public response(
    params?: Partial<ResponseProductDTO & AuditContract> | null,
    setFakeData = false
  ) {
    return plainToInstance(
      ResponseProductDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }
}
