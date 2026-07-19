import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { PermissionsModule } from "@api/iam/permissions/permissions.module";
import { AuthorizationModule } from "@api/iam/authorization/authorization.module";
import { RoleBootstrapService } from "./role-bootstrap.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    PermissionsModule,
    AuthorizationModule,
  ],
  controllers: [RolesController],
  providers: [RolesService, RoleBootstrapService],
  exports: [RolesService, RoleBootstrapService, TypeOrmModule],
})
export class RolesModule {}
