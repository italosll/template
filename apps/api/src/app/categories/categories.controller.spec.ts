import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategoryFactory } from "./factories/category.factory";
// describe("categories.controller", () => {
//   const testControllerUtil = new TestControllerUtil<
//     CreateCategoryDTO,
//     UpdateCategoryDTO,
//     FullCategoryDTO
//   >();

//   const setup = () => {
//     const service = testControllerUtil.setSpies() as CategoriesService;
//     const controller = new CategoriesController(service);
//     return { controller, service };
//   };

//   const methods = testControllerUtil.getControllerMethods(
//     new CategoryFactory()
//   );

//   it.each(methods)(
//     "Should call service.$methodName with parameter: $parameter",
//     async ({ parameter, methodName }) => {
//       const { controller, service } = setup();

//       await controller[methodName](parameter);

//       expect(service[methodName]).toHaveBeenCalledWith(parameter);
//     }
//   );

//   it.each(methods)(
//     "Should service.$methodName respond with $expectedResponse",
//     async ({ parameter, methodName, expectedResponse }) => {
//       const { controller } = setup();

//       const response = await controller[methodName](parameter);

//       expect(response).toStrictEqual(expectedResponse);
//     }
//   );
// });

describe("categories.controller", () => {
  const setup = async () => {
    const service = mock<CategoriesService>();
    const module = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: service,
        },
      ],
    }).compile();

    return {
      controller: module.get<CategoriesController>(CategoriesController),
      service: module.get<CategoriesService>(CategoriesService),
    };
  };

  it("Should filter", async () => {
    const { controller, service } = await setup();

    const filtros = {
      id: 1,
      name: "Test Category",
    };

    await controller.findAll(filtros);

    expect(service.findAll).toHaveBeenCalledWith(filtros);
  });

  it("should create", async () => {
    const { controller, service } = await setup();

    const category = new CategoryFactory().create();

    await controller.create(category);

    expect(service.create).toHaveBeenCalledWith(category);
  });

  it("should update", async () => {
    const { controller, service } = await setup();

    const category = new CategoryFactory().update();

    await controller.update(category);

    expect(service.update).toHaveBeenCalledWith(category);
  });

  it("should delete", async () => {
    const { controller, service } = await setup();

    const ids = [1];
    await controller.delete(ids);
    expect(service.delete).toHaveBeenCalledWith(ids);
  });
});
