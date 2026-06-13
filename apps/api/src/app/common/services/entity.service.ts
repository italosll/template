import { CreateDefaultResponseDTO } from "../../../../../../libs/interfaces/src/lib/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "../../../../../../libs/interfaces/src/lib/update-default-response.dto";

export abstract class EntityService<responseDTO, CreateDTO, UpdateDTO> {
  abstract findAll(product: any): Promise<responseDTO[]>;
  abstract create(createEntity: CreateDTO): Promise<CreateDefaultResponseDTO>;
  abstract update(updateEntity: UpdateDTO): Promise<UpdateDefaultResponseDTO>;
  abstract delete(ids: number[]): void;
  abstract hardDelete(ids: number[]): void;
}
