import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';
import { Type } from '@nestjs/common';
import { QueryParameterContract } from '../contracts/query-parameters.contract';
import { EncryptionService } from '../encryption/encryption.service';
import { HashingService } from '../../iam/hashing/hashing.service';
import { S3FilesService } from '../files/s3-files.service';
const TEST_DEFAULT_HARD_DELETE_ONE_RESPONSE = { raw: {}, affected: 1 , generatedMaps:[]};
const TEST_DEFAULT_DELETE_ONE_RESPONSE = { raw: {}, affected: 1 };

 

interface Entities{
  main: EntityClassOrSchema,
  extraEntities?:EntityClassOrSchema[]
}

export class TestServiceUtil{

  public static async setup<ServiceType>(
    serviceClass:Type<any>, 
    mockEntities:any[], 
    entities:Entities,
  ){
   
   
    const repositories = [entities.main, ...entities?.extraEntities ?? []]?.map((entity)=>({
      provide: getRepositoryToken(entity),
      useClass: Repository
    })) ?? []
   
    const module: TestingModule = await Test.createTestingModule({
      providers:[
        serviceClass,
        ...repositories,
        {
          provide: EncryptionService,
          useValue: {
            encrypt:jest.fn((param)=>param),
            decrypt:jest.fn((param)=>param)
          }
        },
        {
          provide:HashingService,
          useValue:{
            generate: (param) => Promise.resolve(param),
            isMatch: (param) => Promise.resolve(true)
          }
        },
        {
          provide: S3FilesService,
          useValue: {
            upload: jest.fn(),
            getUrlByKey: jest.fn(),
            getFileInfoByS3FileKey: jest.fn()
          }
        }
      ]
    }).compile();

    const serviceInstance  = module.get<ServiceType>(serviceClass );
    const repository = module.get<Repository<any>>(getRepositoryToken(entities.main));

 

    const andWhere = jest.fn();
    const andWhereMultipleColumns = jest.fn();
    const getMany = ()=> Promise.resolve(mockEntities)as any
    const leftJoinAndSelect = jest.fn(()=> ({ getMany }));
    const loadRelationIdAndMap = jest.fn(()=> ({ getMany }));
    jest.spyOn(repository, "find").mockImplementation(() => Promise.resolve(mockEntities));
    jest.spyOn(repository, "createQueryBuilder").mockImplementation(() => ({ 
      andWhere, 
      andWhereMultipleColumns,
      loadRelationIdAndMap,
      getMany, 
      leftJoinAndSelect,
      } as any))

    jest.spyOn(repository, "create").mockImplementation((createUser) => (createUser));
    jest.spyOn(repository, "save").mockImplementation((user)=> Promise.resolve(user));

    jest.spyOn(repository,"findOneBy").mockImplementation((i)=> Promise.resolve(mockEntities?.find((j)=> (i as any).id === j.id )));
    jest.spyOn(repository,"merge").mockImplementation((_, updateUser) => (updateUser as any));

    const softDeleteMock = jest.spyOn(repository, "softDelete").mockImplementation(()=> Promise.resolve(TEST_DEFAULT_HARD_DELETE_ONE_RESPONSE));
    const deleteMock = jest.spyOn(repository, "delete").mockImplementation(()=> Promise.resolve(TEST_DEFAULT_DELETE_ONE_RESPONSE));

    return { module, serviceInstance, repository, andWhere, andWhereMultipleColumns, softDeleteMock, deleteMock}
  };


   public static getQuerysByObject= <T>(object:Partial<T>) =>{

    const querys: QueryParameterContract[] = []

    Object.entries(object).map(([key,value])=>{
      querys.push({ key, value});
    })

    return querys;
  }


}
