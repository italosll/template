import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { ProductFactory } from "./factories/product.factory";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

describe("products.controller", () => {
  const setup = async () => {
    const productsService = mock<ProductsService>();
    const module = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: productsService,
        },
      ],
    }).compile();

    return {
      controller: module.get<ProductsController>(ProductsController),
      service: module.get<ProductsService>(ProductsService),
    };
  };
  it("should filter", async () => {
    const { controller, service } = await setup();

    const filtros = {
      id: 1,
      name: "Test Product",
    };

    await controller.findAll(filtros);

    expect(service.findAll).toHaveBeenCalledWith(filtros);
  });

  it("should create", async () => {
    const { controller, service } = await setup();

    const product = new ProductFactory().create();

    await controller.create(product);

    expect(service.create).toHaveBeenCalledWith(product);
  });

  it("should update", async () => {
    const { controller, service } = await setup();

    const product = new ProductFactory().update();

    await controller.update(product);

    expect(service.update).toHaveBeenCalledWith(product);
  });

  it("should delete", async () => {
    const { controller, service } = await setup();

    await controller.delete([1]);

    expect(service.delete).toHaveBeenCalledWith([1]);
  });
});
