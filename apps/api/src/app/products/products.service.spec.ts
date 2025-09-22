import { Category } from "@api/categories/entities/category.entity";
import { S3FilesService } from "@api/common/files/s3-files.service";
import { createMockQueryBuilder } from "@api/common/utils/mock-repositository";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mock } from "jest-mock-extended";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { ProductFactory } from "./factories/product.factory";
import { ProductsService } from "./products.service";

describe("products.service", () => {
  const product = new ProductFactory().update(null, true);
  const products: Partial<Product>[] = [
    {
      id: 1,
      name: "Test Product",
      s3FileKey: "test-product-key",
    },
    {
      id: 2,
      name: "Another Product",
      s3FileKey: "another-product-key",
    },
  ];

  const image = {
    url: "https://example.com/image.jpg",
    name: "Test Product",
  };

  const productsWithFiles = products.map((product) => ({
    ...product,
    image: image,
  }));

  const setup = async (product: Partial<Product>, modoCadastrar = false) => {
    const repository = mock<Repository<Product>>();
    const queryBuilder = createMockQueryBuilder<Product>();

    queryBuilder.getMany.mockResolvedValue(products as any);

    repository.createQueryBuilder.mockReturnValue(queryBuilder);
    repository.create.mockReturnValue({ ...product } as any);

    repository.findOne = jest
      .fn()
      .mockResolvedValue(modoCadastrar ? null : product) as any;
    repository.find = jest.fn().mockResolvedValue([product]) as any;
    repository.save.mockResolvedValue(product as any);

    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: repository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mock<Repository<Category>>(),
        },
        {
          provide: S3FilesService,
          useValue: mock<S3FilesService>(),
        },
      ],
    }).compile();

    const filesService = module.get<S3FilesService>(S3FilesService);
    filesService.getFileInfoByS3FileKey = jest.fn().mockReturnValue(image);
    const service = module.get<ProductsService>(ProductsService);

    return {
      repository,
      filesService,
      service,
    };
  };

  it("should filter", async () => {
    const product = new ProductFactory().create(null, true);
    const { service } = await setup(product);
    const response = await service.findAll();
    expect(response).toStrictEqual(productsWithFiles);
  });

  it("should create", async () => {
    const product = new ProductFactory().create({ code: "new_code" }, true);
    const { service } = await setup(product, true);
    const response = await service.create(product);
    expect(response).toStrictEqual({ id: 1 });
  });

  it("should update", async () => {
    const product = new ProductFactory().update(null, true);
    const { service } = await setup(product);
    const response = await service.update(product);
    expect(response).toStrictEqual({ id: 1 });
  });

  it("should delete", async () => {
    const product = new ProductFactory().update(null, true);
    const { service } = await setup(product);
    const response = await service.delete([1]);
    expect(response).toStrictEqual({ ids: [1] });
  });
});
