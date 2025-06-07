import { plainToInstance } from "class-transformer";
import { AuditContract } from "../../common/contracts/audit.contract";
import { CreateCategoryDTO } from "../dto/create-category.dto";
import { FullCategoryDTO } from "../dto/full-category.dto";
import { UpdateCategoryDTO } from "../dto/update-category.dto";

export class CategoryFactory {
  private _fakeData: Partial<
    CreateCategoryDTO | UpdateCategoryDTO | FullCategoryDTO
  > = {
    id: 1,
    name: "Default Category Name",
    code: "C123",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    recoveredAt: new Date(),
  };

  public create(
    params?: Partial<CreateCategoryDTO & AuditContract>,
    setFakeData = false
  ) {
    return plainToInstance(
      CreateCategoryDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }

  public update(
    params?: Partial<UpdateCategoryDTO & AuditContract>,
    setFakeData = false
  ) {
    return plainToInstance(
      UpdateCategoryDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }

  public response(
    params?: Partial<FullCategoryDTO & AuditContract>,
    setFakeData = false
  ) {
    return plainToInstance(
      FullCategoryDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }
}
