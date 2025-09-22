import { FactoryContract } from "../contracts/factory.contract";
import { TestControllerMethodContract } from "../contracts/test-controller-method.contract";
import { EntityService } from "../services/entity.service";

const createdResponse = { id: 1 };
const updatedResponse = { id: 1 };
const deletedResponse = { ids: [1] };
const findAllResponse: any = [];

export class TestControllerUtil<CreateDTO, UpdateDTO, GetDTO> {
  public setSpies(service: any = {}) {
    jest
      .spyOn(service, "findAll")
      .mockImplementation(() => Promise.resolve(findAllResponse as any));
    jest
      .spyOn(service, "create")
      .mockImplementation(() => Promise.resolve(createdResponse));
    jest
      .spyOn(service, "update")
      .mockImplementation(() => Promise.resolve(updatedResponse));
    jest
      .spyOn(service, "delete")
      .mockImplementation(() => Promise.resolve(deletedResponse));
    jest
      .spyOn(service, "hardDelete")
      .mockImplementation(() => Promise.resolve(deletedResponse));

    return service;
  }

  public getControllerMethods(
    factory: FactoryContract<CreateDTO, UpdateDTO, GetDTO>
  ) {
    const methods: TestControllerMethodContract<
      EntityService<any, any, any>
    >[] = [
      {
        methodName: "findAll",
        parameter: undefined,
        expectedResponse: null as any,
      },
      {
        methodName: "create",
        parameter: factory.create(null as any, false),
        expectedResponse: createdResponse,
      },
      {
        methodName: "update",
        parameter: factory.update(null as any, false),
        expectedResponse: createdResponse,
      },
      {
        methodName: "delete",
        parameter: 1,
        expectedResponse: deletedResponse,
      },
      {
        methodName: "hardDelete",
        parameter: 1,
        expectedResponse: deletedResponse,
      },
    ] as const;

    return methods;
  }
}
