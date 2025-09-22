import { createMockQueryBuilder } from "@api/common/utils/mock-repositository";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mock } from "jest-mock-extended";
import { Repository } from "typeorm";
import { Category } from "../categories/entities/category.entity";
import { CategoryFactory } from "./../categories/factories/category.factory";
import { CategoriesService } from "./categories.service";

describe("categories.service", () => {
  const category = new CategoryFactory().update(null, true);

  const categories: Partial<Category>[] = [
    {
      id: 1,
      name: "Test Category",
      code: "C123",
    },
    {
      id: 2,
      name: "Test Category 2",
      code: "C123",
    },
  ];

  const setup = async () => {
    const repository = mock<Repository<Category>>();
    const queryBuilder = createMockQueryBuilder<Category>();
    queryBuilder.getMany.mockResolvedValue(categories as any);

    repository.createQueryBuilder.mockReturnValue(queryBuilder);
    repository.create.mockReturnValue({ ...category } as any);
    repository.findOne = jest.fn().mockResolvedValue(category) as any;
    repository.find = jest.fn().mockResolvedValue([category]) as any;
    repository.save.mockResolvedValue(category as any);

    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: repository,
        },
      ],
    }).compile();

    const service = module.get<CategoriesService>(CategoriesService);

    return {
      repository,
      service,
    };
  };

  it("should filter", async () => {
    const { service } = await setup();
    const response = await service.findAll();
    expect(response).toStrictEqual(categories);
  });

  it("should create", async () => {
    const category = new CategoryFactory().create(null, true);
    const { service } = await setup();
    const response = await service.create(category);
    expect(response).toStrictEqual({ id: 1 });
  });

  it("should update", async () => {
    const category = new CategoryFactory().update(null, true);
    const { service, repository } = await setup();
    repository.findOneBy = jest.fn().mockResolvedValue(category) as any;
    const response = await service.update(category);
    expect(response).toStrictEqual({ id: 1 });
  });

  it("should delete", async () => {
    const { service } = await setup();
    const response = await service.delete([1]);
    expect(response).toStrictEqual({ ids: [1] });
  });
});
