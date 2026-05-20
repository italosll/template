import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceOrderController } from "./service-order.controller";
import { ServiceOrderService } from "./service-order.service";
import { ServiceOrder } from "./entities/service-order.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ServiceOrder])],
  providers: [ServiceOrderService],
  controllers: [ServiceOrderController],
  exports: [ServiceOrderService],
})
export class ServiceOrderModule {}
