import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CookieService } from '@client/common/services/app-cookie.service';
import { MAT_CARD_CONFIG } from '@angular/material/card';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
   
    provideAnimations(),
    CookieService,
    
    {provide: MAT_CARD_CONFIG, useValue: {appearance: 'outlined'}},
  ],
};
