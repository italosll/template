import { ProductsService } from './products.service';
import { ProductFactory } from './factories/product.factory';
import { TestServiceUtil } from '../common/utils/test-service.util';
import { Product } from './entities/product.entity';
import { ProductContract } from '@template/interfaces';
import { getQuerys } from './utils/get-query.util';
import { In } from 'typeorm';

const product1 = new ProductFactory({id:1}).fullProduct();
const product2 = new ProductFactory({id:2}).fullProduct();
const product3 = new ProductFactory({id:3}).fullProduct();

export const mockProducts = [
  product1,
  product2,
  product3
];

describe("products.service",()=>{

  it("Should list", async ()=>{
    const { serviceInstance } = await  TestServiceUtil.setup<ProductsService>(ProductsService, Product, mockProducts);

    const response = await serviceInstance.findAll();

    expect(response).toEqual(mockProducts);
  });

  const validFilters = {...mockProducts[0]}
  delete validFilters.image;
  delete validFilters.description;
  const validQuerys = TestServiceUtil.getQuerysByObject<ProductContract>(validFilters);

  it.each(validQuerys)("Should filter by key: $key with value: $value", async ({key,value})=>{
    const { serviceInstance, andWhere} = await  TestServiceUtil.setup<ProductsService>(ProductsService, Product, mockProducts);

    await serviceInstance.findAll({[key]: value} as any as Product);

    const querys = getQuerys(validFilters);

    expect(andWhere).toHaveBeenCalledWith(querys[key].where, querys[key].parameters);
  })


  const invalidQuerys = TestServiceUtil.getQuerysByObject<ProductContract>({
    image: {name:"", url:"url" },
    description: "some description"
  });

  it.each(invalidQuerys)("Shouldn't filter by key: $key with value: $value", async ({key,value})=>{
    const { serviceInstance, andWhere} = await  TestServiceUtil.setup<ProductsService>(ProductsService, Product, mockProducts);

    await serviceInstance.findAll({[key]: value} as any as Product);

    expect(andWhere).not.toHaveBeenCalled();
  })

  const methods = [
    {
      serviceMethodName:"create",
      repositoryMethodName:"save",
      serviceParameter: new ProductFactory({id:1}).createProduct(),
      repositoryParameter: new ProductFactory({id:1}).createProduct()
    },
    {
      serviceMethodName:"update",
      repositoryMethodName:"save",
      serviceParameter: mockProducts[0],
      repositoryParameter: mockProducts[0]
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
    const { serviceInstance, repository} = await  TestServiceUtil.setup<ProductsService>(ProductsService, Product, mockProducts);

    await serviceInstance[serviceMethodName](serviceParameter);

    expect(repository[repositoryMethodName]).toHaveBeenCalledWith(repositoryParameter);
  });

})


