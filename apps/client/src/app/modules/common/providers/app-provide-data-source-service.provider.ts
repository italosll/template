import { DataSourceService } from "@client/common/services/app-data-source.service";

export function provideDataSourceService(service: typeof DataSourceService<any>) {
  return {
    provide: DataSourceService,
    useClass: service,
  };
}

