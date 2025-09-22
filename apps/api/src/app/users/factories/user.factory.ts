import { plainToInstance } from "class-transformer";
import { CreateUserDTO } from "../dto/create-user.dto";
import { responseUserDTO } from "../dto/response-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";

export class UserFactory {
  private _fakeData: Partial<CreateUserDTO | UpdateUserDTO | responseUserDTO> =
    {
      id: 1,
      email: "email@email.com",
      filterableEmail: "emai",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      recoveredAt: new Date(),
    };

  public create(params?: Partial<CreateUserDTO> | null, setFakeData = false) {
    return plainToInstance(
      CreateUserDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }

  public update(params?: Partial<UpdateUserDTO> | null, setFakeData = false) {
    return plainToInstance(
      UpdateUserDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }

  public response(
    params?: Partial<responseUserDTO> | null,
    setFakeData = false
  ) {
    return plainToInstance(
      responseUserDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }
}
