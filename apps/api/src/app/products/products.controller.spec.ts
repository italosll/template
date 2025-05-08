import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductFactory } from './factories/product.factory';
import { TestControllerUtil } from '../common/utils/test-controller.util';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ResponseProductDTO } from './dto/response-product.dto';


describe("categories.controller", ()=>{

  const testControllerUtil = new TestControllerUtil<CreateProductDTO, UpdateProductDTO, ResponseProductDTO>();

  const setup = () => {
    const service = new ProductsService(null,null,null);
    testControllerUtil.setSpies(service)
    const controller = new ProductsController(service);
    return {controller, service};
  }

  const methods = testControllerUtil.getControllerMethods(new ProductFactory())


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
