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


@Injectable()
export class ProductsService implements EntityService<Product, CreateProductDTO, UpdateProductDTO>{

  constructor(@InjectRepository(Product) private _productRepository:Repository<Product> ){}

  async findAll(product?:Partial<UpdateProductDTO>): Promise<Product[]>{
    const queryBuilder = this._productRepository.createQueryBuilder();
    if(product?.id) queryBuilder.andWhere(`id LIKE :id`, { id: `%${product.id}%`});
    if(product?.code) queryBuilder.andWhere(`code LIKE :code`, { code: `%${product.code}%`});
    if(product?.name) queryBuilder.andWhere(`LOWER(name) LIKE LOWER(:name)`, { name: `%${product.name}%`});

    const products =  await queryBuilder.getMany();
    return products;
  }

  async create(createEntity:CreateProductDTO): Promise<CreateDefaultResponseDTO>{
    const registeredProduct = await this._productRepository.findOneBy({code: createEntity.code});

    if(registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.alreadyExists(), HttpStatus.CONFLICT);

  	const entity = this._productRepository.create(createEntity);
  	const created = await this._productRepository.save(entity);
    const response = { id: created.id };
    return response;
  }

  async update(updateEntity?:UpdateProductDTO): Promise<UpdateDefaultResponseDTO>{
    const registeredProduct = await this._productRepository.findOneBy({id: updateEntity.id});

    if(!registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);

    const merged = this._productRepository.merge(registeredProduct, updateEntity);
    await this._productRepository.save(merged);
    const response = { id: registeredProduct.id };

    return response;
  }

  async delete(ids:number[]) {
    const products = await this._productRepository.find();

    ids.forEach(async (id)=>{
      const registeredProduct = products?.find((user)=> user.id === id);
      if(!registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);
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
