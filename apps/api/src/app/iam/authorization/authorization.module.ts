import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD } from "@nestjs/core";
import { UserRoleAssignment } from "./entities/user-role-assignment.entity";
import { UserPermissionAssignment } from "./entities/user-permission-assignment.entity";
import { Role } from "@api/iam/roles/entities/role.entity";
import { Permission } from "@api/iam/permissions/entities/permission.entity";
import { User } from "@api/users/entities/user.entity";
import { AuthorizationRepository } from "./authorization.repository";
import { AuthorizationService } from "./authorization.service";
import { AssignmentsService } from "./assignments.service";
import { AuthorizationController } from "./authorization.controller";
import { PermissionsGuard } from "./guards/permissions.guard";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRoleAssignment,
      UserPermissionAssignment,
      Role,
      Permission,
      User,
    ]),
  ],
  controllers: [AuthorizationController],
  providers: [
    AuthorizationRepository,
    AuthorizationService,
    AssignmentsService,
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
  exports: [AuthorizationService, AssignmentsService],
})
export class AuthorizationModule {}
