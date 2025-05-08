import { CategoryFactory } from './../categories/factories/category.factory';
import { TestServiceUtil } from '../common/utils/test-service.util';
import { In } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { CategoriesService } from './categories.service';
import { getQuerys } from './utils/get-query.util';
import { CategoryContract } from '@interfaces/category.contract';

const {createData, updateData, fullData} = new CategoryFactory()

const category1 = () => fullData({id:1});
const category2 = () => fullData({id:2});
const category3 = () => fullData({id:3});


export const mockCategories= () => [
  category1(),
  category2(),
  category3()
];

describe("categories.service",()=>{
 
  const validFilters = { ...category1()}
 
  const validQuerys = TestServiceUtil.getQuerysByObject<CategoryContract>(validFilters);

  const setup = () => TestServiceUtil.setup<CategoriesService>(
    CategoriesService, 
    mockCategories(),
    {
        main:Category,    
    }
  );

  it.each(validQuerys)("Should filter by key: $key with value: $value", async ({key,value})=>{
    const { serviceInstance, andWhere} = await  setup()

    await serviceInstance.findAll({[key]: value} as any as Category);

    const querys = getQuerys(validFilters);
 

    expect(andWhere).toHaveBeenCalledWith(querys[key].where, querys[key].parameters);
  })

  const methods = [
    {
      serviceMethodName:"create",
      repositoryMethodName:"save",
      serviceParameter: createData({id:1}),
      repositoryParameter: createData({id:1})
    },
    {
      serviceMethodName:"update",
      repositoryMethodName:"save",
      serviceParameter: updateData({id:1}),
      repositoryParameter: {
        ...updateData({id:1}),
      }
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
    const { serviceInstance, repository} = await setup()

    await serviceInstance[serviceMethodName](serviceParameter);
 
    expect(repository[repositoryMethodName]).toHaveBeenCalledWith({...repositoryParameter});
  });

})


