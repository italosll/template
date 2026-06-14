
import { EntityService } from "@api/common/services/entity.service";
import { HTTP_ERROR_MESSAGES } from "@api/common/utils/http-error-messages.util";
import { Product } from "@api/products/entities/product.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateQuotationDTO } from "./dto/create-quotation.dto";
import { ResponseQuotationDTO } from "./dto/response-quotation.dto";
import { UpdateQuotationDTO } from "./dto/update-quotation.dto";
import { Quotation } from "./entities/quotation.entity";
import { getQueriesParameters } from "./utils/get-queries-parameters.util";
import { Client } from "../client/entities/client.entity";
import { ServiceOrder } from "../service-order/entities/service-order.entity";
import { CreateDefaultResponseDTO } from "@interfaces/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "@interfaces/update-default-response.dto";

@Injectable()
export class QuotationService
  implements
    EntityService<ResponseQuotationDTO, CreateQuotationDTO, UpdateQuotationDTO>
{
  constructor(
    @InjectRepository(Quotation)
    private readonly _quotationRepository: Repository<Quotation>,
    @InjectRepository(Client)
    private readonly _clientRepository: Repository<Client>,
    @InjectRepository(Product)
    private readonly _productRepository: Repository<Product>,
    @InjectRepository(ServiceOrder)
    private readonly _serviceOrderRepository: Repository<ServiceOrder>
  ) {}

  async findAll(params: {
    textToSearch?: string;
    id?: number;
  }): Promise<ResponseQuotationDTO[]> {
    const queryBuilder = this._quotationRepository.createQueryBuilder(
      "quotation"
    );

    const queriesParameters = getQueriesParameters();
    queryBuilder.andWhereMultipleColumns(params, queriesParameters);

    const quotations = await queryBuilder
      .loadRelationIdAndMap("quotation.productIds", "quotation.products")
      .loadRelationIdAndMap(
        "quotation.serviceOrderIds",
        "quotation.serviceOrders"
      )
      .loadRelationIdAndMap("quotation.clientId", "quotation.client")
      .getMany();

    return quotations as ResponseQuotationDTO[];
  }

  async create(
    createQuotation: CreateQuotationDTO
  ): Promise<CreateDefaultResponseDTO> {
    const client = await this._clientRepository.findOneBy({
      id: createQuotation.clientId,
    });

    if (!client) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

    const products = await this._productRepository.findBy({
      id: In(createQuotation.productIds ?? []),
    });

    if (products.length !== createQuotation.productIds?.length) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

    const serviceOrders = await this._serviceOrderRepository.findBy({
      id: In(createQuotation.serviceOrderIds ?? []),
    });

    if (serviceOrders.length !== createQuotation.serviceOrderIds?.length) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

    const entity = this._quotationRepository.create(createQuotation);
    entity.client = client;
    entity.products = products;
    entity.serviceOrders = serviceOrders;

    const created = await this._quotationRepository.save(entity);
    return { id: created.id };
  }

  async update(
    updateQuotation?: UpdateQuotationDTO
  ): Promise<UpdateDefaultResponseDTO> {
    const registeredQuotation = await this._quotationRepository.findOneBy({
      id: updateQuotation?.id,
    });

    if (!registeredQuotation) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

    const merged = this._quotationRepository.merge(
      registeredQuotation,
      updateQuotation ?? {}
    );

    if (updateQuotation?.clientId) {
      const client = await this._clientRepository.findOneBy({
        id: updateQuotation.clientId,
      });

      if (!client) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
      }

      merged.client = client;
    }

    if (updateQuotation?.productIds) {
      const products = await this._productRepository.findBy({
        id: In(updateQuotation.productIds ?? []),
      });

      if (products.length !== updateQuotation.productIds?.length) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
      }

      merged.products = products;
    }

    if (updateQuotation?.serviceOrderIds) {
      const serviceOrders = await this._serviceOrderRepository.findBy({
        id: In(updateQuotation.serviceOrderIds ?? []),
      });

      if (serviceOrders.length !== updateQuotation.serviceOrderIds?.length) {
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
      }

      merged.serviceOrders = serviceOrders;
    }

    await this._quotationRepository.save(merged);
    return { id: registeredQuotation.id };
  }

  async delete(ids: number[]) {
    const quotations = await this._quotationRepository.find();

    for (const id of ids) {
      const registeredQuotation = quotations?.find(
        (quotation) => quotation.id === id
      );
      if (!registeredQuotation)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
    }

    await this._quotationRepository.softDelete({ id: In(ids) });
    return { ids };
  }

  async hardDelete(ids: number[]) {
    const quotations = await this._quotationRepository.find();

    for (const id of ids) {
      const registeredQuotation = quotations?.find(
        (quotation) => quotation.id === id
      );
      if (!registeredQuotation)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
    }

    await this._quotationRepository.delete({ id: In(ids) });
    return { ids };
  }
}
