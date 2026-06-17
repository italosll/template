import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateDefaultResponseDTO } from "../../../../../libs/interfaces/src/lib/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "../../../../../libs/interfaces/src/lib/update-default-response.dto";
import { EntityService } from "../common/services/entity.service";
import { HTTP_ERROR_MESSAGES } from "../common/utils/http-error-messages.util";
import { CreateServiceOrderDTO } from "./dto/create-service-order.dto";
import { ResponseServiceOrderDTO } from "./dto/response-service-order.dto";
import { UpdateServiceOrderDTO } from "./dto/update-service-order.dto";
import { ServiceOrder } from "./entities/service-order.entity";
import { getQueriesParameters } from "./utils/get-queries-parameters.util";

@Injectable()
export class ServiceOrderService
  implements
    EntityService<
      ResponseServiceOrderDTO,
      CreateServiceOrderDTO,
      UpdateServiceOrderDTO
    >
{
  constructor(
    @InjectRepository(ServiceOrder)
    private readonly _serviceOrderRepository: Repository<ServiceOrder>
  ) {}

  async findAll(
 params:{textToSearch?:string, id?:number} 
  ): Promise<ResponseServiceOrderDTO[]> {
    const queryBuilder = this._serviceOrderRepository.createQueryBuilder(
      "serviceOrder"
    );

    const queriesParameters = getQueriesParameters();
    queryBuilder.andWhereMultipleColumns(
      params,
      queriesParameters
    );
 
    const serviceOrders = await queryBuilder.getMany();
    return serviceOrders as ResponseServiceOrderDTO[];
  }

  async create(
    createServiceOrder: CreateServiceOrderDTO
  ): Promise<CreateDefaultResponseDTO> {
    const entity = this._serviceOrderRepository.create(createServiceOrder);
    const created = await this._serviceOrderRepository.save(entity);
    return { id: created.id };
  }

  async update(
    updateServiceOrder?: UpdateServiceOrderDTO
  ): Promise<UpdateDefaultResponseDTO> {
    const registeredServiceOrder =
      await this._serviceOrderRepository.findOneBy({
        id: updateServiceOrder?.id,
      });

    if (!registeredServiceOrder)
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );

    const merged = this._serviceOrderRepository.merge(
      registeredServiceOrder,
      updateServiceOrder ?? {}
    );

    await this._serviceOrderRepository.save(merged);
    return { id: registeredServiceOrder.id };
  }

  async delete(ids: number[]) {
    const serviceOrders = await this._serviceOrderRepository.find();

    for (const id of ids) {
      const registeredServiceOrder = serviceOrders?.find(
        (serviceOrder) => serviceOrder.id === id
      );
      if (!registeredServiceOrder)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
    }

    await this._serviceOrderRepository.softDelete({ id: In(ids) });
    return { ids };
  }

  async hardDelete(ids: number[]) {
    const serviceOrders = await this._serviceOrderRepository.find();

    for (const id of ids) {
      const registeredServiceOrder = serviceOrders?.find(
        (serviceOrder) => serviceOrder.id === id
      );
      if (!registeredServiceOrder)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
    }

    await this._serviceOrderRepository.delete({ id: In(ids) });
    return { ids };
  }
}
