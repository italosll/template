import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TestControllerUtil } from '../common/utils/test-controller.util';
import { CategoryFactory } from './factories/category.factory';


describe("categories.controller", ()=>{

  const setup = () => {
    const service = new CategoriesService(null);
    TestControllerUtil.setSpies(service)
    const controller = new CategoriesController(service);

    return {controller, service};
  }

  const methods = TestControllerUtil.getControllerMethods(new CategoryFactory())


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
