import { CreateDefaultResponseDTO } from "@interfaces/create-default-response.dto";
import { DeleteDefaultResponseDTO } from "@interfaces/delete-default-response.dto";
import { HardDeleteDefaultResponseDTO } from "@interfaces/hard-delete-default-response.dto";
import { ServiceOrderContract } from "@interfaces/service-order.contract";
import { UpdateDefaultResponseDTO } from "@interfaces/update-default-response.dto";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CreateServiceOrderDTO } from "./dto/create-service-order.dto";
import { UpdateServiceOrderDTO } from "./dto/update-service-order.dto";
import { ServiceOrderController } from "./service-order.controller";
import { ServiceOrderService } from "./service-order.service";

const createServiceMock = () => ({
  create: vi.fn().mockResolvedValue({ id: 1 }),
  findAll: vi.fn().mockResolvedValue([]),
  update: vi.fn().mockResolvedValue({ id: 1 }),
  delete: vi.fn().mockResolvedValue({ ids: [1, 2] }),
  hardDelete: vi.fn().mockResolvedValue({ ids: [1, 2] }),
});

describe("ServiceOrderController", () => {
  const setup = async () => {
    const serviceOrderService = createServiceMock();

    const module = await Test.createTestingModule({
      controllers: [ServiceOrderController],
      providers: [
        {
          provide: ServiceOrderService,
          useValue: serviceOrderService,
        },
      ],
    }).compile();

    return {
      controller: module.get<ServiceOrderController>(ServiceOrderController),
      serviceOrderService,
    };
  };

  it("should filter", async () => {
    const { controller, serviceOrderService } = await setup();

    const query: Partial<ServiceOrderContract> = {
      id: 1,
      description: "Test service order",
    };

    await controller.findAll(query);

    expect(serviceOrderService.findAll).toHaveBeenCalledWith(query);
  });

  it("should create", async () => {
    const { controller, serviceOrderService } = await setup();

    const dto: CreateServiceOrderDTO = {
      description: "Test service order",
      price: 100,
    };

    const result = await controller.create(dto);

    expect(serviceOrderService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1 } as CreateDefaultResponseDTO);
  });

  it("should update", async () => {
    const { controller, serviceOrderService } = await setup();

    const dto: UpdateServiceOrderDTO = {
      id: 1,
      description: "Updated service order",
      price: 150,
    };
    serviceOrderService.update.mockResolvedValue({ id: dto.id });

    const result = await controller.update(dto);

    expect(serviceOrderService.update).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1 } as UpdateDefaultResponseDTO);
  });

  it("should delete", async () => {
    const { controller, serviceOrderService } = await setup();

    const ids = [1, 2];

    const result = await controller.delete(ids);

    expect(serviceOrderService.delete).toHaveBeenCalledWith(ids);
    expect(result).toEqual({ ids } as DeleteDefaultResponseDTO);
  });

  it("should hard delete", async () => {
    const { controller, serviceOrderService } = await setup();

    const ids = [1, 2];

    const result = await controller.hardDelete(ids);

    expect(serviceOrderService.hardDelete).toHaveBeenCalledWith(ids);
    expect(result).toEqual({ ids } as HardDeleteDefaultResponseDTO);
  });

  it("should propagate service errors", async () => {
    const { controller, serviceOrderService } = await setup();

    const dto: CreateServiceOrderDTO = {
      description: "Test service order",
      price: 100,
    };
    serviceOrderService.create.mockRejectedValue(new Error("boom"));

    await expect(controller.create(dto)).rejects.toThrow("boom");
  });
});

describe("ServiceOrderController (integration)", () => {
  let app: INestApplication;
  let serviceOrderService: ReturnType<typeof createServiceMock>;

  beforeAll(async () => {
    serviceOrderService = createServiceMock();

    const module = await Test.createTestingModule({
      controllers: [ServiceOrderController],
      providers: [
        {
          provide: ServiceOrderService,
          useValue: serviceOrderService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    serviceOrderService.create.mockResolvedValue({ id: 1 });
    serviceOrderService.findAll.mockResolvedValue([]);
    serviceOrderService.update.mockResolvedValue({ id: 1 });
    serviceOrderService.delete.mockResolvedValue({ ids: [1, 2] });
    serviceOrderService.hardDelete.mockResolvedValue({ ids: [1, 2] });
  });

  it("should parse delete ids with ParseArrayPipe", async () => {
    await request(app.getHttpServer())
      .delete("/service-orders?ids=1,2")
      .expect(200);

    expect(serviceOrderService.delete).toHaveBeenCalledWith([1, 2]);
  });

  it("should parse hardDelete ids with ParseArrayPipe", async () => {
    await request(app.getHttpServer())
      .delete("/service-orders/hardDelete?ids=1,2")
      .expect(200);

    expect(serviceOrderService.hardDelete).toHaveBeenCalledWith([1, 2]);
  });

  it("should reject invalid create payloads with ValidationPipe", async () => {
    await request(app.getHttpServer())
      .post("/service-orders")
      .send({})
      .expect(400);

    expect(serviceOrderService.create).not.toHaveBeenCalled();
  });

  it("should transform and validate create payloads", async () => {
    await request(app.getHttpServer())
      .post("/service-orders")
      .send({ description: "Test service order", price: "100" })
      .expect(201);

    expect(serviceOrderService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Test service order",
        price: 100,
      }),
    );
    expect(serviceOrderService.create.mock.calls[0][0]).toBeInstanceOf(
      CreateServiceOrderDTO,
    );
  });
});
