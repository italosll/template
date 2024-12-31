import { CategoryFactory } from './../categories/factories/category.factory';
import { ProductsService } from './products.service';
import { ProductFactory } from './factories/product.factory';
import { TestServiceUtil } from '../common/utils/test-service.util';
import { Product } from './entities/product.entity';
import { ProductContract } from '@template/interfaces';
import { getQuerys } from './utils/get-query.util';
import { In } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

const {createData, updateData,fullData, fullDataWithRelations } = new ProductFactory()
const {updateData: updateCategory } = new CategoryFactory()

const product1 = () => fullData({id:1});
const product2 = () => fullData({id:2});
const product3 = () => fullData({id:3});


export const mockProducts= () => [
  product1(),
  product2(),
  product3()
];

describe("products.service",()=>{
 
  const validFilters = { ...fullDataWithRelations()}
  delete validFilters.image;
  delete validFilters.description;
  delete validFilters.categories;
  delete validFilters.categoryIds; // until find product by categories is enabled
 
  const validQuerys = TestServiceUtil.getQuerysByObject<ProductContract>(validFilters);

  const setup = (categories=[]) => TestServiceUtil.setup<ProductsService>(
    ProductsService, 
    mockProducts(),
    {
      
        main:Product,
        extraEntities:[
          {
            entity:Category,
            spies:[
              {
                repositoryMethod:"find" as never,
                implementation: ()=> categories as never
              }
            ]
          }
        ]
    }
  );

  it.each(validQuerys)("Should filter by key: $key with value: $value", async ({key,value})=>{
    const { serviceInstance, andWhere} = await  setup()

    await serviceInstance.findAll({[key]: value} as any as Product);

    const querys = getQuerys(validFilters);
 
    expect(andWhere).toHaveBeenCalledWith(querys[key].where, querys[key].parameters);
  })


  const invalidQuerys = TestServiceUtil.getQuerysByObject<ProductContract>({
    image: {name:"", url:"url" },
  });

  it.each(invalidQuerys)("Shouldn't filter by key: $key with value: $value", async ({key,value})=>{
    const { serviceInstance, andWhere} = await setup()

    await serviceInstance.findAll({[key]: value} as any as Product);

    expect(andWhere).not.toHaveBeenCalled();
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
      serviceParameter: updateData({id:1, categoryIds: [1,2]}),
      repositoryParameter: {
        ...updateData(),
        id:1,
        categoryIds: [1,2], 
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

  ]

  it.each(methods)("$serviceMethodName Should have called repository.$repositoryMethodName with correct $repositoryParameter", async ({
    repositoryMethodName,
    serviceMethodName,
    serviceParameter,
    repositoryParameter
  })=>{

 
    const categories =serviceParameter?.["categoryIds"]?.map(
      (id)=> new CategoryFactory().updateData({id})
    );

    const { serviceInstance, repository} = await setup(categories)

    await serviceInstance[serviceMethodName](serviceParameter);
 
    expect(repository[repositoryMethodName]).toHaveBeenCalledWith({...repositoryParameter});
  });

})


