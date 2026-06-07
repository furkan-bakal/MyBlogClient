import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from '../core/api/auth.interceptor';
import { refreshInterceptor } from '../core/api/refresh.interceptor';
import { loadingInterceptor } from '../core/api/loading.interceptor';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideZonelessChangeDetection(),
    provideHttpClient(
      withFetch(),
      withInterceptors([loadingInterceptor, authInterceptor, refreshInterceptor]),
    ),
  ],
};
