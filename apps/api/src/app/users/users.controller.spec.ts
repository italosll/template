import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserFactory } from './factories/user.factory';

type MethodInfo<T> = {
  methodName: keyof T,
  parameter:any,
  expectedResponse:any
}

describe("users.controller", ()=>{
  const createdResponse = { id: 1 };
  const updatedResponse = { id: 1 };
  const deletedResponse = { id: 1 };
  const findAllResponse = [];

  const setup = () => {
    const service = new UsersService(null);

    jest.spyOn(service,"findAll").mockImplementation(()=> Promise.resolve(findAllResponse));
    jest.spyOn(service,"create").mockImplementation(()=> Promise.resolve(createdResponse));
    jest.spyOn(service,"update").mockImplementation(()=> Promise.resolve(updatedResponse));
    jest.spyOn(service,"delete").mockImplementation(()=> Promise.resolve(deletedResponse));
    jest.spyOn(service,"hardDelete").mockImplementation(()=> Promise.resolve(deletedResponse));

    const controller = new UsersController(service);

    return {controller, service};
  }

  const methods: MethodInfo<UsersService>[] = [
    {
      methodName: "findAll",
      parameter: undefined,
      expectedResponse: findAllResponse
    },
    {
      methodName: "create",
      parameter: new UserFactory().createUser(),
      expectedResponse: createdResponse
    },
    {
      methodName: "update",
      parameter: new UserFactory().updateUser(),
      expectedResponse: createdResponse
    },
    {
      methodName: "delete",
      parameter: 1,
      expectedResponse: deletedResponse
    },
    {
      methodName: "hardDelete",
      parameter: 1,
      expectedResponse: deletedResponse
    },
  ] as const
  it.each(methods)("Should call service.$methodName with parameter: $parameter", async ({
    parameter,
    methodName,
  })=>{
    const { controller, service } = setup();

    await controller[methodName](parameter);

    expect(service[methodName]).toHaveBeenCalledWith(parameter);
  })

  it.each(methods)("Should service.$methodName respond with $expectedResponse", async ({
    parameter,
    methodName,
    expectedResponse
  })=>{
    const { controller } = setup();

    const response = await controller[methodName](parameter);

    expect(response).toStrictEqual(expectedResponse);
  });

})
