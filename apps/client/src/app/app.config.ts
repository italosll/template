import { provideHttpClient, withFetch } from "@angular/common/http";
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from "@angular/core";
import { MAT_CARD_CONFIG } from "@angular/material/card";
import { MAT_ICON_DEFAULT_OPTIONS } from "@angular/material/icon";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { CookieService } from "@client/common/services/app-cookie.service";
import { ThemeService } from "@client/common/services/app-theme.service";
import { appRoutes } from "./app.routes";
import { DialogsOpenerService } from "@client/common/services/app-dialogs-opener.service";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    CookieService,


    { provide: MAT_CARD_CONFIG, useValue: { appearance: "outlined" } },
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: {
        fontSet: "material-icons-round",
      },
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
