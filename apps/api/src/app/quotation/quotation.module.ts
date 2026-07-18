import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "@api/products/entities/product.entity";
import { QuotationController } from "./quotation.controller";
import { QuotationService } from "./quotation.service";
import { Quotation } from "./entities/quotation.entity";
import { QuotationProduct } from "./entities/quotation-product.entity";
import { QuotationServiceOrder } from "./entities/quotation-service-order.entity";
import { Client } from "../client/entities/client.entity";
import { ServiceOrder } from "../service-order/entities/service-order.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quotation,
      QuotationProduct,
      QuotationServiceOrder,
      Client,
      Product,
      ServiceOrder,
    ]),
  ],
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}
