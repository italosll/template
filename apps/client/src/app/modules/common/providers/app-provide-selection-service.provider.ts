import { SelectionService } from "@client/common/services/app-selection.service";

export function provideSelectionService(service: typeof SelectionService) {
  return {
    provide: SelectionService,
    useClass: service,
  };
}
