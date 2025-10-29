import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.accessToken;
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // No refrescar si la petición es de auth
      const isAuthUrl = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register') || req.url.includes('/api/auth/refresh');
      const alreadyRetried = req.headers.has('X-Retry');

      if (error.status === 401 && !isAuthUrl && !alreadyRetried && auth.refreshToken) {
        // Intentar refrescar una sola vez y reintentar la petición original
        return auth.refresh().pipe(
          switchMap(() => {
            const newToken = auth.accessToken;
            const retriedReq: HttpRequest<any> = req.clone({
              setHeaders: newToken ? { Authorization: `Bearer ${newToken}` } : {},
              headers: req.headers.set('X-Retry', 'true')
            });
            return next(retriedReq);
          }),
          catchError(refreshErr => {
            // Falló el refresh: cerrar sesión y redirigir
            auth.logout(false).subscribe({
              complete: () => router.navigate(['/login'], { queryParams: { returnUrl: location.pathname } })
            });
            return throwError(() => refreshErr);
          })
        );
      }

      if (error.status === 401 && !isAuthUrl) {
        auth.logout(false).subscribe({
          complete: () => router.navigate(['/login'], { queryParams: { returnUrl: location.pathname } })
        });
      }
      return throwError(() => error);
    })
  );
};
