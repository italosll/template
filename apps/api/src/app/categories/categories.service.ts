import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { EntityService } from "../common/services/entity.service";
import { Category } from "./entities/category.entity";
import { CreateCategoryDTO } from "./dto/create-category.dto";
import { UpdateCategoryDTO } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm"
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { HTTP_ERROR_MESSAGES } from "../common/utils/http-error-messages.util";
import { FullCategoryDTO } from "./dto/full-category.dto";

@Injectable()
export class CategoriesService implements EntityService<Category, CreateCategoryDTO, UpdateCategoryDTO >{

  constructor(@InjectRepository(Category) private _categoryRepository: Repository<Category>){}

  async findAll(category?: Partial<FullCategoryDTO>): Promise<Category[]> {

    const queryBuilder = this._categoryRepository.createQueryBuilder();
    if(category?.id) queryBuilder.andWhere(`id LIKE :id`, {id: `%${category.id}%`});
    if(category?.name) queryBuilder.andWhere(`LOWER(name) LIKE LOWER(:name)`, {name: `%${category.name}%`});
    if(category?.code) queryBuilder.andWhere(`code LIKE :code`, {code: `%${category.code}%`});

    if(category?.createdAt) queryBuilder.andWhere(`createdAt LIKE :createdAt`, { createdAt: `%${category.createdAt}%`});
    if(category?.updatedAt) queryBuilder.andWhere(`updatedAt LIKE :updatedAt`, { updatedAt: `%${category.updatedAt}%`});
    if(category?.deletedAt) queryBuilder.andWhere(`deletedAt LIKE :deletedAt`, { deletedAt: `%${category.deletedAt}%`});
    if(category?.recoveredAt) queryBuilder.andWhere(`recoveredAt LIKE :recoveredAt`, { recoveredAt: `%${category.recoveredAt}%`});

    const categories = await queryBuilder.getMany();
    return categories;
  }


  async create(createEntity:CreateCategoryDTO): Promise<CreateDefaultResponseDTO>{
    const registeredProduct = await this._categoryRepository.findOneBy({code: createEntity.code});

    if(registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.alreadyExists(), HttpStatus.CONFLICT);

  	const entity = this._categoryRepository.create(createEntity);
  	const created = await this._categoryRepository.save(entity);
    const response = { id: created.id };
    return response;
  }

  async update(updateEntity?:UpdateCategoryDTO): Promise<UpdateDefaultResponseDTO>{
    const registeredProduct = await this._categoryRepository.findOneBy({id: updateEntity.id});

    if(!registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);

    const merged = this._categoryRepository.merge(registeredProduct, updateEntity);
    await this._categoryRepository.save(merged);
    const response = { id: registeredProduct.id };

    return response;
  }

  async delete(ids:number[]) {
    const products = await this._categoryRepository.find();

    ids.forEach(async (id)=>{
      const registeredProduct = products?.find((user)=> user.id === id);
      if(!registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);
    })

    await this._categoryRepository.softDelete({id: In(ids)});
    return { ids };
  }

  async hardDelete(ids:number[]) {
    const products = await this._categoryRepository.find();

    ids.forEach(async (id)=>{
      const registeredProduct = products?.find((user)=> user.id === id);
      if(!registeredProduct) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);
    })

    await this._categoryRepository.delete({id: In(ids)});
    return { ids };
  }
}
