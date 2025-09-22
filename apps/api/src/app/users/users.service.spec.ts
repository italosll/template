import { EncryptionService } from "@api/common/encryption/encryption.service";
import { createMockQueryBuilder } from "@api/common/utils/mock-repositository";
import { HashingService } from "@api/iam/hashing/hashing.service";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mock } from "jest-mock-extended";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { UserFactory } from "./factories/user.factory";
import { UsersService } from "./users.service";

const users: Partial<User>[] = [
  new UserFactory().response({ id: 1 }, true),
  new UserFactory().response({ id: 2 }, true),
  new UserFactory().response({ id: 3 }, true),
];

describe("users.service", () => {
  // const user = new CategoryFactory().update(null, true);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const setup = async (user: Partial<User>) => {
    const repository = mock<Repository<User>>();

    const queryBuilder = createMockQueryBuilder<User>();
    queryBuilder.getMany.mockResolvedValue(users as any);

    // User.decrypt = jest.fn().mockReturnValue(users);
    // User.encrypt = jest.fn().mockReturnValue(user);
    // const entidade = new User();
    // entidade.id = 2;

    jest.spyOn(User, "encrypt").mockReturnValue(user as User);
    jest.spyOn(User, "decrypt").mockReturnValue(users as User[]);

    const encryptionService = mock<EncryptionService>();

    repository.createQueryBuilder.mockReturnValue(queryBuilder);
    repository.create.mockReturnValue({ ...user } as any);

    const hashingService = mock<HashingService>();
    hashingService.generate.mockImplementation(() =>
      Promise.resolve("hashed password")
    );

    console.log("####");
    console.log(user);

    repository.findOne = jest.fn().mockResolvedValue(user) as any;
    repository.find = jest.fn().mockResolvedValue([user]) as any;
    repository.save.mockResolvedValue(user as any);

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repository,
        },
        {
          provide: EncryptionService,
          useValue: encryptionService,
        },
        {
          provide: HashingService,
          useValue: hashingService,
        },
      ],
    }).compile();

    const service = module.get<UsersService>(UsersService);

    return {
      repository,
      service,
    };
  };

  it("should filter", async () => {
    const user = new UserFactory().create({ email: "new@email.com.br" }, true);

    const { service } = await setup(user);
    const response = await service.findAll();
    expect(response).toStrictEqual(users);
  });

  it("should create", async () => {
    const user = new UserFactory().create({ email: "new@email.com.br" }, true);
    const { service } = await setup(user);
    const response = await service.create(user);
    expect(response).toStrictEqual({ id: 1 });
  });

  it("should update", async () => {
    const user = new UserFactory().update(null, true);
    const { service } = await setup(user);
    const response = await service.update(user);
    expect(response).toStrictEqual({ id: 1 });
  });

  it("should delete", async () => {
    const user = new UserFactory().update(null, true);

    const { service } = await setup(user);
    const response = await service.delete([user.id]);
    expect(response).toStrictEqual({ ids: [user.id] });
  });
});
