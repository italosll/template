import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { Client } from "@api/client/entities/client.entity";
import { Product } from "@api/products/entities/product.entity";
// import { ServiceOrder } from "@api/service-order/entities/service-order.entity";
import { QuotationController } from "./quotation.controller";
import { QuotationService } from "./quotation.service";
import { Quotation } from "./entities/quotation.entity";
import { Client } from "../client/entities/client.entity";
import { ServiceOrder } from "../service-order/entities/service-order.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Quotation, Client, Product, ServiceOrder]),
  ],
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}
