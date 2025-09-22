import { BaseHttpService } from "@client/common/http/app-base.http.service";

export function provideBaseHttpService(service: typeof BaseHttpService<any>) {
  return {
    provide: BaseHttpService,
    useClass: service,
  };
}
