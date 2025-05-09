import { CategoryFactory } from './../categories/factories/category.factory';
import { ProductsService } from './products.service';
import { ProductFactory } from './factories/product.factory';
import { Product } from './entities/product.entity';
import { getQueriesParameters } from './utils/get-queries-parameters.util';
import { In, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { TestServiceUtil } from '../common/utils/test-service.util';
import { getRepositoryToken } from '@nestjs/typeorm';

const productFactory = new ProductFactory();

const {updateData: updateCategory } = new CategoryFactory()

const product1 = () => productFactory.response({id:1}, true);
const product2 = () => productFactory.response({id:2}, true);
const product3 = () => productFactory.response({id:3}, true);


export const mockProducts= () => [
  product1(),
  product2(),
  product3()
];

const queriesParameters = getQueriesParameters();


describe("products.service",()=>{

  const setup = () => 
    TestServiceUtil.setup<ProductsService>(
    ProductsService, 
    mockProducts(),
    {
        main:Product,
        extraEntities:[Category]
    },
  );

  it.each(getQueriesParameters())("Should filter by key: $key with value: $value", async ({
  like
  })=>{
    const { serviceInstance, andWhereMultipleColumns} = await  setup()

    const query = {[like]: product1()[like]}
    await serviceInstance.findAll(query);

    expect(andWhereMultipleColumns).toHaveBeenCalledWith(query, queriesParameters);
  })


  const methods = [
    {
      serviceMethodName:"create",
      repositoryMethodName:"save",
      serviceParameter: productFactory.create({categoryIds: [1,2]},true),
      repositoryParameter: {
        ...productFactory.create({categoryIds: [1,2]},true),
        id:1,
        categories: [updateCategory({id:1}), updateCategory({id:2})]
      }
      
    },
    {
      serviceMethodName:"update",
      repositoryMethodName:"save",
      serviceParameter: productFactory.update( { id:1,  categoryIds: [1,2] },
      true
    ),
      repositoryParameter: {
        ...productFactory.update(null,true),
        id:1,
        categories: [updateCategory({id:1}), updateCategory({id:2})]
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

  ] as const

  it.each(methods)("$serviceMethodName Should have called repository.$repositoryMethodName with correct $repositoryParameter", async ({
    repositoryMethodName,
    serviceMethodName,
    serviceParameter,
    repositoryParameter
  })=>{

    const categories = serviceParameter?.["categoryIds"]?.map(
      (id)=> new CategoryFactory().updateData({id})
    );
    
    const { serviceInstance, repository, module} = await setup()
    repository.findOne = jest.fn(() => Promise.resolve(serviceMethodName === "create" ? null : product1()));
    const categoryRepository =  module.get<Repository<Category>>(getRepositoryToken(Category));
    categoryRepository.findBy = jest.fn(() => Promise.resolve(categories as Category[]));

    await serviceInstance[serviceMethodName](serviceParameter as any);
 
    expect(repository[repositoryMethodName]).toHaveBeenCalledWith({...repositoryParameter });
  });

})


