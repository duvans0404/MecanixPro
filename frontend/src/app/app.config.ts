import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { timeoutInterceptor } from './interceptors/timeout.interceptor';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
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
