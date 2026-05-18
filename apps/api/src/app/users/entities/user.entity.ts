import { UserContract } from "@interfaces/user.contract";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EncryptionService } from "../../common/encryption/encryption.service";
import { Audit } from "../../common/utils/audit.util";
import { CreateUserDTO } from "../dto/create-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";
import { Tenant } from "@api/iam/entities/tenant.entity";
import { CreateTenantContract } from "@interfaces/tenant.contract";

@Entity()
export class User extends Audit implements UserContract, CreateTenantContract {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email?: string;

  @Column({ select: false })
  filterableEmail?: string;

  @Column({ unique: true, nullable: true })
  phoneNumber?: string;

  @Column({ select: false ,nullable: true})
  filterablePhoneNumber?: string;

  @Column({ select: false })
  password!: string;

  @Column({ type: "json", nullable: true })
  roleIds?: number[];

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenant!: Tenant;

  @Column({ nullable: true })
  tenantId!: number

  public static encrypt(
    userData: CreateUserDTO | UpdateUserDTO,
    encryptionService: EncryptionService,
    tenant:Tenant
  ): User {
    const user = new User();
    
    user.filterableEmail = userData?.email?.slice(0, 4);
    user.filterablePhoneNumber = userData?.phoneNumber?.slice(0, 4);
    user.password = userData.password;
    user.tenant = tenant;
    user.roleIds = userData.roleIds;

    if (userData?.email) {
      user.email = encryptionService?.encrypt(userData?.email);
    }

    if (userData?.phoneNumber) {
      user.phoneNumber = encryptionService.encrypt(userData?.phoneNumber);
    }

    return user;
  }

  public static decrypt(
    usersData: (UserContract & Audit & {tenantId: number})[],
    encryptionService: EncryptionService
  ): User   [] {
    const users: User[] = [];

    usersData?.forEach((u) => {
      const user = new User();
      user.id = u.id;
      user.filterablePhoneNumber = u.filterablePhoneNumber;
      user.password = u.password;
      user.createdAt = u.createdAt;
      user.deletedAt = u.deletedAt;
      user.updatedAt = u.updatedAt;
      user.recoveredAt = u.recoveredAt;
      user.tenantId = u.tenantId;
      user.roleIds = u.roleIds;

      if (u.email) {
        (user.email = encryptionService.decrypt(u.email)),
          (user.filterableEmail = u.filterableEmail);
      }
      if (u.phoneNumber) {
        user.phoneNumber = encryptionService.decrypt(u.phoneNumber);
      }

      users.push(user);
    });

    return users;
  }

  // @AfterLoad()
  // public static async _loadDecrytedUser(){
  //   const crypography = new Cryptography();
  //   this.email = crypography.decrypt(this.email);
  // }
}
