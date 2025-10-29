import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const required = (route.data?.['roles'] as string[]) || [];

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  if (required.length === 0) return true;

  // 1) Check roles from token first (fast path)
  const tokenRoles = auth.roles.map((r) => String(r).toUpperCase());
  const okFromToken = required.some((r) => tokenRoles.includes(String(r).toUpperCase()));
  if (okFromToken) return true;

  // 2) Fallback: fetch fresh roles from profile (reflect DB changes without relogin)
  return auth.getProfile().pipe(
    map(({ user }) => {
      const raw = (user.roles as any[] | undefined) || (user.role ? [user.role] : []);
      const fresh = raw
        .map((r: any) => (typeof r === 'string' ? r : r?.name))
        .filter((v: any) => !!v)
        .map((v: string) => v.toUpperCase());
      return required.some((r) => fresh.includes(String(r).toUpperCase()));
    }),
    map((ok) => (ok ? true : router.createUrlTree(['/dashboard']))),
    // If profile fails, deny access
    catchError(() => {
      return of(router.createUrlTree(['/dashboard']));
    })
  );
};
