import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
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
import { ResponseProductDTO } from "./dto/response-product.dto";
import { S3FilesService } from "../common/files/s3-files.service";
import { ProductFactory } from "./factories/product.factory";
import { ColumnQueryParameters } from "../common/utils/crud-helper.util";
import { getQueriesParameters } from "./utils/get-queries-parameters.util";

@Injectable()
export class ProductsService implements EntityService<ResponseProductDTO, CreateProductDTO, UpdateProductDTO>{

  constructor(
    @InjectRepository(Product) private _productRepository:Repository<Product>,
    @InjectRepository(Category) private _categoryRepository:Repository<Category>,
    @Inject(S3FilesService) private _filesService: S3FilesService
  ){
  }

  private _findOneProduct(key:string, value:unknown): Promise<Product>{
    return this._productRepository.findOne(
      {
        where: { [key]: value },
        relations: ["categories"]
      }
    );
  }

  async findAll(product?:Partial<ResponseProductDTO>): Promise<ResponseProductDTO[]>{
    const queryBuilder = this._productRepository.createQueryBuilder("product");
    const queriesParameters:ColumnQueryParameters<Product>[] = getQueriesParameters();

    queryBuilder.andWhereMultipleColumns(product, queriesParameters);

    const products =  await queryBuilder
      .loadRelationIdAndMap("product.categoryIds", "product.categories")
      .getMany();

    const productsWithFiles = products.map(
      (product)=>({
          ...new ProductFactory().response(product),
          image: this._filesService.getFileInfoByS3FileKey(product.s3FileKey, product.name)
        })
    );
    return productsWithFiles;
  }

  async create(createProduct:CreateProductDTO): Promise<CreateDefaultResponseDTO>{
    const registeredProduct = await this._findOneProduct("code", createProduct.code);
    
    if(registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.alreadyExists(), HttpStatus.CONFLICT);
    const categories = await this._categoryRepository.findBy({ id: In(createProduct.categoryIds)});
  	const entity = this._productRepository.create(createProduct);
    entity.categories = categories;
    entity.s3FileKey = await this._filesService.upload(["products"],createProduct?.image?.base64File, registeredProduct?.s3FileKey);
    const created = await this._productRepository.save(entity);
    const response = { id: created.id };
    return response;
  }

  async update(entity?:UpdateProductDTO): Promise<UpdateDefaultResponseDTO>{
    const registeredProduct = await this._findOneProduct("id", entity.id);

    if(!registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);
    
    const categories = await this._categoryRepository.findBy({ id: In(entity.categoryIds)});
    this._productRepository.merge(registeredProduct, entity);
    registeredProduct.categories = categories;    
    registeredProduct.s3FileKey = await this._filesService.upload(["products"],entity?.image?.base64File, registeredProduct?.s3FileKey);
    
    await this._productRepository.save( registeredProduct );
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
