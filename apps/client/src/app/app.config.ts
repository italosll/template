import { provideHttpClient, withFetch } from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { MAT_CARD_CONFIG } from "@angular/material/card";
import { MAT_ICON_DEFAULT_OPTIONS } from "@angular/material/icon";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { CookieService } from "@client/common/services/app-cookie.service";
import { appRoutes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),

    provideAnimations(),
    CookieService,

    { provide: MAT_CARD_CONFIG, useValue: { appearance: "outlined" } },
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: {
        fontSet: "material-icons-round",
      },
    },
  ],
};
