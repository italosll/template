import { Type } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";

export function provideBaseHttpService<
  ResponseFindAll,
  ResponseFindById,
  RequestCreate,
  RequestUpdate,
>(
  service: Type<
    BaseHttpService<
      ResponseFindAll,
      ResponseFindById,
      RequestCreate,
      RequestUpdate
    >
  >
) {
  return {
    provide: BaseHttpService,
    useClass: service,
  };
}

