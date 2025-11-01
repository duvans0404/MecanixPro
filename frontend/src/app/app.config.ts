import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { timeoutInterceptor } from './core/interceptors/timeout.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      loadingInterceptor, // primero: muestra carga para todas
      loggingInterceptor,
      timeoutInterceptor,
      authInterceptor
    ])),
    provideAnimationsAsync(),
    ConfirmationService,
    MessageService
  ]
};
