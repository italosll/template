import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { DeleteDefaultResponseDTO } from "../common/dto/delete-default-response.dto";
import { HardDeleteDefaultResponseDTO } from "../common/dto/hard-delete-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { UserFactory } from "./factories/user.factory";
import { UsersController } from "./users.controller";

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  hardDelete: jest.fn(),
};

describe("UsersController", () => {
  let controller: UsersController;
  let service: typeof mockService;

  beforeEach(() => {
    service = { ...mockService };
    controller = new UsersController(service as any);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should call service.create with correct params", async () => {
    const dto = new UserFactory().create();
    const expected: CreateDefaultResponseDTO = { id: 1 };
    service.create.mockResolvedValue(expected);
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(expected);
  });

  it("should call service.findAll with correct params", async () => {
    const query = { email: "test@email.com" };
    const expected = [new UserFactory().update()];
    service.findAll.mockResolvedValue(expected);
    const result = await controller.findAll(query as any);
    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(result).toBe(expected);
  });

  it("should call service.update with correct params", async () => {
    const dto = new UserFactory().update();
    const expected: UpdateDefaultResponseDTO = { id: 1 };
    service.update.mockResolvedValue(expected);
    const result = await controller.update(dto);
    expect(service.update).toHaveBeenCalledWith(dto);
    expect(result).toBe(expected);
  });

  it("should call service.delete with correct params", async () => {
    const ids = [1, 2];
    const expected: DeleteDefaultResponseDTO = { ids };
    service.delete.mockResolvedValue(expected);
    const result = await controller.delete(ids);
    expect(service.delete).toHaveBeenCalledWith(ids);
    expect(result).toBe(expected);
  });

  it("should call service.hardDelete with correct params", async () => {
    const ids = [1, 2];
    const expected: HardDeleteDefaultResponseDTO = { ids };
    service.hardDelete.mockResolvedValue(expected);
    const result = await controller.hardDelete(ids);
    expect(service.hardDelete).toHaveBeenCalledWith(ids);
    expect(result).toBe(expected);
  });
});
