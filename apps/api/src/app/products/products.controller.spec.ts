import { ProductsController } from './products.controller';
import { TestControllerUtil } from '../common/utils/test-controller.util';
import { ProductsService } from './products.service';
import { ProductFactory } from './factories/product.factory';


describe("categories.controller", ()=>{

  const setup = () => {
    const service = new ProductsService(null,null);
    TestControllerUtil.setSpies(service)
    const controller = new ProductsController(service);

    return {controller, service};
  }

  const methods = TestControllerUtil.getControllerMethods(new ProductFactory())


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
