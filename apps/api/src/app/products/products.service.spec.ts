import { TestCrudTypesEnum } from './../common/enums/test-crud-types.enum';
import { CategoryFactory } from './../categories/factories/category.factory';
import { ProductsService } from './products.service';
import { ProductFactory } from './factories/product.factory';
import { Product } from './entities/product.entity';
import { getQueriesParameters } from './utils/get-queries-parameters.util';
import { In } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { TestServiceUtil } from '../common/utils/test-service.util';

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

  const setup = (categories=[], testType?:TestCrudTypesEnum) => 
    TestServiceUtil.setup<ProductsService>(
    ProductsService, 
    mockProducts(),
    {
        main:Product,
        extraEntities:[
          {
            entity:Category,
            spies:[
              {
                repositoryMethod:"findBy" as never,
                implementation: ()=> categories as never
              }
            ]
          }
        ]
    },
    testType
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

    const categories =serviceParameter?.["categoryIds"]?.map(
      (id)=> new CategoryFactory().updateData({id})
    );
 
    const { serviceInstance, repository} = await setup(categories, serviceMethodName as TestCrudTypesEnum)

    await serviceInstance[serviceMethodName](serviceParameter as any);
 
    expect(repository[repositoryMethodName]).toHaveBeenCalledWith({...repositoryParameter });
  });

})


