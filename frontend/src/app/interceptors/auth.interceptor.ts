import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.accessToken;
  const isAuthUrl = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register') || req.url.includes('/api/auth/refresh') || req.url.includes('/api/auth/forgot-password') || req.url.includes('/api/auth/reset-password') || req.url.includes('/api/auth/logout');
  const isOurApi = req.url.startsWith('/api') || req.url.startsWith('http://localhost:3001');

  const attachAuthHeader = (r: HttpRequest<any>, t: string | null) =>
    t && !isAuthUrl && isOurApi ? r.clone({ setHeaders: { Authorization: `Bearer ${t}` } }) : r;

  // Proactive refresh: skip for auth endpoints
  if (!isAuthUrl && isOurApi && token && !auth.isAuthenticated() && auth.refreshToken) {
    return auth.ensureRefreshed().pipe(
      switchMap((newToken) => {
        const refreshedReq = attachAuthHeader(req, newToken);
        return next(refreshedReq);
      }),
      catchError((refreshErr) => {
        auth.logout(false).subscribe({
          complete: () => router.navigate(['/login'], { queryParams: { returnUrl: location.pathname } })
        });
        return throwError(() => refreshErr);
      })
    );
  }

  req = attachAuthHeader(req, token);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const alreadyRetried = req.headers.has('X-Retry');

      if (error.status === 401 && !isAuthUrl && isOurApi && !alreadyRetried && auth.refreshToken) {
        // Intentar refrescar una sola vez y reintentar la petición original
        return auth.ensureRefreshed().pipe(
          switchMap((newToken) => {
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
