import { EntityService } from "@api/common/services/entity.service";
import { HTTP_ERROR_MESSAGES } from "@api/common/utils/http-error-messages.util";
import { Product } from "@api/products/entities/product.entity";
import { CreateDefaultResponseDTO } from "@interfaces/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "@interfaces/update-default-response.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Client } from "../client/entities/client.entity";
import { ServiceOrder } from "../service-order/entities/service-order.entity";
import { CreateQuotationProductDTO } from "./dto/create-quotation-product.dto";
import { CreateQuotationServiceOrderDTO } from "./dto/create-quotation-service-order.dto";
import { CreateQuotationDTO } from "./dto/create-quotation.dto";
import { ResponseQuotationProductDTO } from "./dto/response-quotation-product.dto";
import { ResponseQuotationServiceOrderDTO } from "./dto/response-quotation-service-order.dto";
import { ResponseQuotationDTO } from "./dto/response-quotation.dto";
import { UpdateQuotationDTO } from "./dto/update-quotation.dto";
import { QuotationProduct } from "./entities/quotation-product.entity";
import { QuotationServiceOrder } from "./entities/quotation-service-order.entity";
import { Quotation } from "./entities/quotation.entity";
import { getQueriesParameters } from "./utils/get-queries-parameters.util";

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
      .leftJoinAndSelect("quotation.products", "products")
      .leftJoinAndSelect("quotation.serviceOrders", "serviceOrders")
      .loadRelationIdAndMap("quotation.clientId", "quotation.client")
      .getMany();

    return quotations.map((quotation) => this.toResponseDTO(quotation));
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

    const products = await this.resolveProducts(createQuotation.products);
    const serviceOrders = await this.resolveServiceOrders(
      createQuotation.serviceOrders
    );

    const entity = this._quotationRepository.create({
      observation: createQuotation.observation,
      client,
      products: this.mapQuotationProducts(createQuotation.products, products),
      serviceOrders: this.mapQuotationServiceOrders(
        createQuotation.serviceOrders,
        serviceOrders
      ),
    });

    const created = await this._quotationRepository.save(entity);
    return { id: created.id };
  }

  async update(
    updateQuotation?: UpdateQuotationDTO
  ): Promise<UpdateDefaultResponseDTO> {
    const registeredQuotation = await this._quotationRepository.findOne({
      where: { id: updateQuotation?.id },
      relations: ["products", "serviceOrders"],
    });

    if (!registeredQuotation) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

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

      registeredQuotation.client = client;
    }

    if (updateQuotation?.observation !== undefined) {
      registeredQuotation.observation = updateQuotation.observation;
    }

    if (updateQuotation?.products) {
      const products = await this.resolveProducts(updateQuotation.products);
      registeredQuotation.products = this.mapQuotationProducts(
        updateQuotation.products,
        products
      );
    }

    if (updateQuotation?.serviceOrders) {
      const serviceOrders = await this.resolveServiceOrders(
        updateQuotation.serviceOrders
      );
      registeredQuotation.serviceOrders = this.mapQuotationServiceOrders(
        updateQuotation.serviceOrders,
        serviceOrders
      );
    }

    await this._quotationRepository.save(registeredQuotation);
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

  private async resolveProducts(
    quotationProducts: CreateQuotationProductDTO[]
  ): Promise<Product[]> {
    const productIds = quotationProducts.map((item) => item.productId);
    if (productIds.length === 0) {
      return [];
    }

    const products = await this._productRepository.findBy({
      id: In(productIds),
    });

    if (products.length !== new Set(productIds).size) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

    return products;
  }

  private async resolveServiceOrders(
    quotationServiceOrders: CreateQuotationServiceOrderDTO[]
  ): Promise<ServiceOrder[]> {
    const serviceOrderIds = quotationServiceOrders.map(
      (item) => item.serviceOrderId
    );
    if (serviceOrderIds.length === 0) {
      return [];
    }

    const serviceOrders = await this._serviceOrderRepository.findBy({
      id: In(serviceOrderIds),
    });

    if (serviceOrders.length !== new Set(serviceOrderIds).size) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

    return serviceOrders;
  }

  private mapQuotationProducts(
    items: CreateQuotationProductDTO[],
    products: Product[]
  ): QuotationProduct[] {
    const productsById = new Map(
      products.map((product) => [product.id, product])
    );

    return items.map((item) => {
      const quotationProduct = new QuotationProduct();
      quotationProduct.product = productsById.get(item.productId)!;
      quotationProduct.manufacturer = item.manufacturer;
      quotationProduct.unity = item.unity;
      quotationProduct.amount = item.amount;
      quotationProduct.price = item.price;
      quotationProduct.discount = item.discount ?? 0;
      return quotationProduct;
    });
  }

  private mapQuotationServiceOrders(
    items: CreateQuotationServiceOrderDTO[],
    serviceOrders: ServiceOrder[]
  ): QuotationServiceOrder[] {
    const serviceOrdersById = new Map(
      serviceOrders.map((serviceOrder) => [serviceOrder.id, serviceOrder])
    );

    return items.map((item) => {
      const quotationServiceOrder = new QuotationServiceOrder();
      quotationServiceOrder.serviceOrder = serviceOrdersById.get(
        item.serviceOrderId
      )!;
      quotationServiceOrder.amount = item.amount;
      quotationServiceOrder.price = item.price;
      quotationServiceOrder.discount = item.discount ?? 0;
      return quotationServiceOrder;
    });
  }

  private toResponseDTO(quotation: Quotation): ResponseQuotationDTO {
    return {
      id: quotation.id,
      clientId: quotation.clientId,
      observation: quotation.observation,
      products: (quotation.products ?? []).map((item) =>
        this.toQuotationProductResponseDTO(item)
      ),
      serviceOrders: (quotation.serviceOrders ?? []).map((item) =>
        this.toQuotationServiceOrderResponseDTO(item)
      ),
    };
  }

  private toQuotationProductResponseDTO(
    item: QuotationProduct
  ): ResponseQuotationProductDTO {
    return {
      id: item.id,
      productId: item.productId,
      manufacturer: item.manufacturer,
      unity: item.unity,
      amount: item.amount,
      price: item.price,
      discount: item.discount,
    };
  }

  private toQuotationServiceOrderResponseDTO(
    item: QuotationServiceOrder
  ): ResponseQuotationServiceOrderDTO {
    return {
      id: item.id,
      serviceOrderId: item.serviceOrderId,
      amount: item.amount,
      price: item.price,
      discount: item.discount,
    };
  }
}
