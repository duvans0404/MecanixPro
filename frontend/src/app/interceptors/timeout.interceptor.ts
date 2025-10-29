import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  // Aplicar un timeout más largo para todas las peticiones HTTP
  const timeoutMs = 60000; // 60 segundos
  
  return next(req).pipe(
    timeout(timeoutMs)
  );
};