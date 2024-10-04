import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {UserContract} from "@template/interfaces"
import { Audit } from "../../common/utils/audit.util";
import { EncryptionService } from "../../common/encryption/encryption.service";


@Entity()
export class User extends Audit implements UserContract{
  @PrimaryGeneratedColumn()
  id:number;

  @Column({ unique: true })
  email:string;

  @Column({ select: false })
  filterableEmail:string;

  @Column({ select: false })
  password:string;

  public static encrypt(userData: Partial<UserContract>, encryptionService:EncryptionService): User{
    const user = new User();
    user.filterableEmail = userData.email.slice(0,4);
    user.email = encryptionService.encrypt(userData.email);
    user.password = userData.password;

    return user;
  }

  public static decrypt(usersData:Partial<(UserContract & Audit)>[], encryptionService:EncryptionService): User[]{

    const users: User[] = [];

    usersData?.forEach(u => {
      const user = new User();
      user.id = u.id;
      user.email = encryptionService.decrypt(u.email),
      user.filterableEmail = u.filterableEmail;
      user.password= u.password;
      user.createdAt = u.createdAt;
      user.deletedAt = u.deletedAt;
      user.updatedAt = u.updatedAt;
      user.recoveredAt = u.recoveredAt;

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
