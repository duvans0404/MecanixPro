import { HttpInterceptorFn } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  const hasAuth = req.headers.has('Authorization');
  const isOurApi = req.url.startsWith('/api') || req.url.startsWith('http://localhost:3001');
  
  console.log(`🚀 [HTTP] ${req.method} ${req.url}`, {
    headers: req.headers.keys().reduce((acc, key) => {
      if (key.toLowerCase() === 'authorization') {
        acc[key] = '[REDACTED]';
      } else {
        acc[key] = req.headers.get(key);
      }
      return acc;
    }, {} as any),
    body: req.body,
    hasAuth,
    isOurApi
  });

  return next(req).pipe(
    tap({
      next: (event: any) => {
        if (event.status) {
          const duration = Date.now() - startTime;
          console.log(`✅ [HTTP] ${req.method} ${req.url} - ${event.status} (${duration}ms)`, event);
        }
      }
    }),
    catchError(error => {
      const duration = Date.now() - startTime;
      console.error(`❌ [HTTP] ${req.method} ${req.url} - Error (${duration}ms)`, error);
      return throwError(() => error);
    })
  );
};