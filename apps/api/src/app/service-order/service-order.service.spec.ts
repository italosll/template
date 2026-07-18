// import "reflect-metadata";

import { HttpException, HttpStatus } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Repository } from "typeorm";
import { HTTP_ERROR_MESSAGES } from "../common/utils/http-error-messages.util";

class ServiceOrderEntity {}

vi.mock("./entities/service-order.entity", () => ({
  ServiceOrder: ServiceOrderEntity,
}));

describe("ServiceOrderService", () => {
  const serviceOrder = {
    id: 1,
    description: "Test service order",
    price: 100,
  };

  const createQueryBuilderMock = () => {
    const queryBuilder = {
      andWhereMultipleColumns: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([serviceOrder]),
    };

    return queryBuilder;
  };

  const setup = async ({
    findOneByResult = serviceOrder,
    findResult = [serviceOrder],
  }: {
    findOneByResult?: typeof serviceOrder | null;
    findResult?: typeof serviceOrder[];
  } = {}) => {
    const queryBuilder = createQueryBuilderMock();
    const { ServiceOrderService } = await import("./service-order.service");

    const repository = {
      createQueryBuilder: vi.fn().mockReturnValue(queryBuilder),
      create: vi.fn().mockImplementation((dto) => ({ ...dto })),
      save: vi.fn().mockImplementation(async (entity) => ({
        ...entity,
        id: entity.id ?? serviceOrder.id,
      })),
      findOneBy: vi.fn().mockResolvedValue(findOneByResult),
      find: vi.fn().mockResolvedValue(findResult),
      merge: vi.fn().mockImplementation((target, source) => ({
        ...target,
        ...source,
      })),
      softDelete: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    } as Partial<Repository<any>>;

    const module = await Test.createTestingModule({
      providers: [
        ServiceOrderService,
        {
          provide: getRepositoryToken(ServiceOrderEntity),
          useValue: repository,
        },
      ],
    }).compile();

    return {
      repository,
      queryBuilder,
      service: module.get(ServiceOrderService),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should filter", async () => {
    const { service, queryBuilder } = await setup();

    const params = {
      id: 1,
      textToSearch: "Test service order",
    };

    const response = await service.findAll(params);

    expect(queryBuilder.andWhereMultipleColumns).toHaveBeenCalledWith(
      params,
      expect.any(Array)
    );
    expect(queryBuilder.getMany).toHaveBeenCalledTimes(1);
    expect(response).toStrictEqual([serviceOrder]);
  });

  it("should create", async () => {
    const { service, repository } = await setup();

    const dto = {
      description: "New service order",
      price: 150,
    };

    const response = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(dto);
    expect(response).toStrictEqual({ id: 1 });
  });

  it("should update", async () => {
    const { service, repository } = await setup();

    const dto = {
      id: 1,
      description: "Updated service order",
      price: 200,
    };

    const response = await service.update(dto);

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repository.merge).toHaveBeenCalledWith(serviceOrder, dto);
    expect(repository.save).toHaveBeenCalledWith({ ...serviceOrder, ...dto });
    expect(response).toStrictEqual({ id: 1 });
  });

  it("should throw when update target does not exist", async () => {
    const { service } = await setup({ findOneByResult: null });

    await expect(
      service.update({
        id: 1,
        description: "Missing service order",
        price: 200,
      })
    ).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
      message: HTTP_ERROR_MESSAGES.notFound(),
    });
  });

  it("should delete", async () => {
    const { service, repository } = await setup();

    const ids = [1];

    const response = await service.delete(ids);

    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(repository.softDelete).toHaveBeenCalledWith({ id: expect.anything() });
    expect(response).toStrictEqual({ ids });
  });

  it("should throw when delete target does not exist", async () => {
    const { service } = await setup({ findResult: [] });

    await expect(service.delete([1])).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
      message: HTTP_ERROR_MESSAGES.notFound(),
    });
  });

  it("should hard delete", async () => {
    const { service, repository } = await setup();

    const ids = [1];

    const response = await service.hardDelete(ids);

    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith({ id: expect.anything() });
    expect(response).toStrictEqual({ ids });
  });

  it("should throw when hard delete target does not exist", async () => {
    const { service } = await setup({ findResult: [] });

    await expect(service.hardDelete([1])).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
      message: HTTP_ERROR_MESSAGES.notFound(),
    });
  });
});