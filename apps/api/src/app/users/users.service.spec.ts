import { TestServiceUtil } from '../common/utils/test-service.util';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserContract } from '@template/interfaces';
import { UserFactory } from './factories/user.factory';
import { getQuerys } from './utils/get-query.util';
import { In } from 'typeorm';

const user1 = new UserFactory({id:1}).fullUser();
const user2 = new UserFactory({id:2}).fullUser();
const user3 = new UserFactory({id:3}).fullUser();

export const mockUsers = [
  user1,
  user2,
  user3
];

describe("users.service",()=>{

  it("Should list", async ()=>{
    const { serviceInstance } = await  TestServiceUtil.setup<UsersService>(UsersService, User, mockUsers);

    const response = await serviceInstance.findAll();

    expect(response).toEqual(mockUsers);
  });

  const validFilters = {...mockUsers[0]}
  delete validFilters.password;
  delete validFilters.email;
  const validQuerys = TestServiceUtil.getQuerysByObject<UserContract>(validFilters);

  it.each(validQuerys)("Should filter by key: $key with value: $value", async ({key,value})=>{
    const { serviceInstance, andWhere} = await  TestServiceUtil.setup<UsersService>(UsersService, User, mockUsers);

    await serviceInstance.findAll({[key]: value} as any as User);

    const querys = getQuerys(validFilters);

    expect(andWhere).toHaveBeenCalledWith(querys[key].where, querys[key].parameters);
  })


  const invalidQuerys = TestServiceUtil.getQuerysByObject<UserContract>({password:"somePassword"});

  it.each(invalidQuerys)("Shouldn't filter by key: $key with value: $value", async ({key,value})=>{
    const { serviceInstance, andWhere} = await  TestServiceUtil.setup<UsersService>(UsersService, User, mockUsers);

    await serviceInstance.findAll({[key]: value} as any as User);

    expect(andWhere).not.toHaveBeenCalled();
  })

  const methods = [
    {
      serviceMethodName:"create",
      repositoryMethodName:"save",
      serviceParameter:{ email:"create@email.com", password:"#123$543@" },
      repositoryParameter:{ email:"create@email.com", filterableEmail: "crea",password:"#123$543@" }
    },
    {
      serviceMethodName:"update",
      repositoryMethodName:"save",
      serviceParameter: mockUsers[0],
      repositoryParameter: mockUsers[0]
    },
    {
      serviceMethodName:"delete",
      repositoryMethodName:"softDelete",
      serviceParameter: [1],
      repositoryParameter: {id: In([1])}

    },
    {
      serviceMethodName:"hardDelete",
      repositoryMethodName:"delete",
      serviceParameter: [1],
      repositoryParameter: {id: In([1])}

    }
  ]

  it.each(methods)("$serviceMethodName Should have called repository.$repositoryMethodName with correct $repositoryParameter", async ({
    repositoryMethodName,
    serviceMethodName,
    serviceParameter,
    repositoryParameter
  })=>{
    const { serviceInstance, repository } = await  TestServiceUtil.setup<UsersService>(UsersService, User, mockUsers);

    await serviceInstance[serviceMethodName](serviceParameter);

    expect(repository[repositoryMethodName]).toHaveBeenCalledWith(repositoryParameter);
  });
})


