import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";

import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { HTTP_ERROR_MESSAGES } from "../common/utils/http-error-messages.util";
import { Product } from "./entities/product.entity";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { EntityService } from "../common/services/entity.service";
import { Category } from "../categories/entities/category.entity";
import { ProductWithCategoriesDTO } from "./dto/product-with-categories.dto";
import { FullProductDTO } from "./dto/full-product.dto";

@Injectable()
export class ProductsService implements EntityService<Product, CreateProductDTO, UpdateProductDTO>{

  constructor(
    @InjectRepository(Product) private _productRepository:Repository<Product>,
    @InjectRepository(Category) private _categoryRepository:Repository<Category>,
  ){}

  async findAll(product?:Partial<FullProductDTO>): Promise<Product[]>{
    const queryBuilder = this._productRepository.createQueryBuilder("product");
    if(product?.id) queryBuilder.andWhere(`id LIKE :id`, { id: `%${product.id}%`});
    if(product?.code) queryBuilder.andWhere(`code LIKE :code`, { code: `%${product.code}%`});
    if(product?.name) queryBuilder.andWhere(`LOWER(name) LIKE LOWER(:name)`, { name: `%${product.name}%`});
    if(product?.description) queryBuilder.andWhere(`LOWER(description) LIKE LOWER(:description)`, { description: `%${product.description}%`});


    if(product?.createdAt) queryBuilder.andWhere(`createdAt LIKE :createdAt`, { createdAt: `%${product.createdAt}%`});
    if(product?.updatedAt) queryBuilder.andWhere(`updatedAt LIKE :updatedAt`, { updatedAt: `%${product.updatedAt}%`});
    if(product?.deletedAt) queryBuilder.andWhere(`deletedAt LIKE :deletedAt`, { deletedAt: `%${product.deletedAt}%`});
    if(product?.recoveredAt) queryBuilder.andWhere(`recoveredAt LIKE :recoveredAt`, { recoveredAt: `%${product.recoveredAt}%`});

    const products =  await queryBuilder.leftJoinAndSelect("product.categories", "category").getMany();
    return products;
  }

  private async _getCategoriesByIds(ids:number[] | null ){
    if(!ids) return null
    const querys = ids.map((id) => ({id}));
    return await this._categoryRepository.find({ where: querys });
  }

  private async _getEntityWithRelationships(createEntity:CreateProductDTO|UpdateProductDTO){
    if(createEntity.categoryIds){
      const categories = await this._getCategoriesByIds(createEntity.categoryIds)

      const createEntityWithRelations =  { ...createEntity, categories };
      return createEntityWithRelations;
    }
    return createEntity
  }

  async create(createEntity:CreateProductDTO): Promise<CreateDefaultResponseDTO>{
    const registeredProduct = await this._productRepository.findOneBy({code: createEntity.code});

    if(registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.alreadyExists(), HttpStatus.CONFLICT);

    createEntity = await this._getEntityWithRelationships(createEntity);

  	const entity = this._productRepository.create(createEntity);
  	const created = await this._productRepository.save(entity);
    const response = { id: created.id };
    return response;
  }

  async update(updateEntity?:UpdateProductDTO): Promise<UpdateDefaultResponseDTO>{
    const registeredProduct = await this._productRepository.findOneBy({id: updateEntity.id});

    if(!registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);

    const categories = await this._getCategoriesByIds(updateEntity.categoryIds);
    
    updateEntity = await this._getEntityWithRelationships(updateEntity)  as  ProductWithCategoriesDTO & {id:number};
    const merged = this._productRepository.merge(registeredProduct, updateEntity);
    merged.categories = categories;
    merged.id = updateEntity.id;
    console.log("merged")
    // console.log(merged)
    console.log(updateEntity)


    await this._productRepository.save(merged);
    const response = { id: registeredProduct.id };

    return response;
  }

  async delete(ids:number[]) {
    const products = await this._productRepository.find();

    ids.forEach(async (id)=>{
      const registeredProduct = products?.find((user)=> user.id === id);
      if(!registeredProduct) throw new HttpException(`${HTTP_ERROR_MESSAGES.notFound()} | idNotFound:${id}`, HttpStatus.NOT_FOUND);
    })

    await this._productRepository.softDelete({id: In(ids)});
    return { ids };
  }

  async hardDelete(ids:number[]) {
    const products = await this._productRepository.find();

    ids.forEach(async (id)=>{
      const registeredProduct = products?.find((user)=> user.id === id);
      if(!registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);
    })

    await this._productRepository.delete({id: In(ids)});
    return { ids };
  }
}
