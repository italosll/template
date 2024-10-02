import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from "../../users/users.service";
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';
import { Type } from '@nestjs/common';
import { QueryParameterContract } from '../contracts/QueryParameters.contract';
import { EncryptionService } from '../services/encryption.service';
import { HashService } from '../services/hash.service';
const TEST_DEFAULT_HARD_DELETE_ONE_RESPONSE = { raw: {}, affected: 1 , generatedMaps:[]};
const TEST_DEFAULT_DELETE_ONE_RESPONSE = { raw: {}, affected: 1 };

const TEST_DEFAULT_CREATED_ID = 1;
export class TestServiceUtil{

  public static async setup<ServiceType>(serviceClass:Type<any>, entity:EntityClassOrSchema, mockEntities:any[]){
    const module: TestingModule = await Test.createTestingModule({
      providers:[
        // UsersService,
        {provide: UsersService, useClass: serviceClass },
        {
          provide: getRepositoryToken(entity),
          useClass: Repository
        },
        {
          provide: EncryptionService,
          useValue: {
            encrypt:jest.fn((param)=>param),
            decrypt:jest.fn((param)=>param)
          }
        },
        {
          provide:HashService,
          useValue:{
generate: (param) => Promise.resolve(param),
isMatch: (param) => Promise.resolve(true)
          }
        }
      ]
    }).compile();

    const serviceInstance  = module.get<ServiceType>(serviceClass );
    const repository = module.get<Repository<any>>(getRepositoryToken(entity));

    // Hash.generate = jest.fn((text)=> Promise.resolve( `hashed_${text}`));

    const andWhere = jest.fn();
    jest.spyOn(repository, "find").mockImplementation(() => Promise.resolve(mockEntities));
    jest.spyOn(repository, "createQueryBuilder").mockImplementation(() => ({ andWhere, getMany: ()=> Promise.resolve(mockEntities)} as any));

    // For test purpouses create and save methods just return the object received.
    jest.spyOn(repository, "create").mockImplementation((createUser) => (createUser));
    jest.spyOn(repository, "save").mockImplementation((user)=> Promise.resolve(user));

    jest.spyOn(repository,"findOneBy").mockImplementation((i)=> Promise.resolve(mockEntities?.find((j)=> (i as any).id === j.id )));
    jest.spyOn(repository,"merge").mockImplementation((_, updateUser) => (updateUser as any));

    jest.spyOn(repository, "softDelete").mockImplementation(()=> Promise.resolve(TEST_DEFAULT_HARD_DELETE_ONE_RESPONSE));
    jest.spyOn(repository, "delete").mockImplementation(()=> Promise.resolve(TEST_DEFAULT_DELETE_ONE_RESPONSE));

    return { serviceInstance, repository, andWhere}
  };


   public static getQuerysByObject= <T>(object:Partial<T>) =>{

    const querys: QueryParameterContract[] = []

    Object.entries(object).map(([key,value])=>{
      querys.push({ key, value});
    })

    return querys;
  }


}
