import { CreateDefaultResponseDTO } from "../dto/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "../dto/update-default-response.dto";

export abstract class EntityService<responseDTO, CreateDTO, UpdateDTO> {
  abstract findAll(product: UpdateDTO): Promise<responseDTO[]>;
  abstract create(createEntity: CreateDTO): Promise<CreateDefaultResponseDTO>;
  abstract update(updateEntity: UpdateDTO): Promise<UpdateDefaultResponseDTO>;
  abstract delete(ids: number[]): void;
  abstract hardDelete(ids: number[]): void;
}
