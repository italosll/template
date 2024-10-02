import { CreateDefaultResponseDTO } from "../../common/dto/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "../../common/dto/update-default-response.dto";
import { CreateUserDTO } from "../dto/create-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";


export interface UsersServiceContract {
  findAll(user: Pick<UpdateUserDTO, "email" | "id">): Promise<User[]>;
  create(createEntity: CreateUserDTO): Promise<CreateDefaultResponseDTO>;
  update(updateEntity: UpdateUserDTO): Promise<UpdateDefaultResponseDTO>;
  delete(id: number): void;
  hardDelete(id: number): void;
}
