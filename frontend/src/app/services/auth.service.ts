import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap, map } from 'rxjs';
import { AuthResponse, AuthUser, TokenPayload } from '../models/auth.model';

const ACCESS_TOKEN_KEY = 'mp_access_token';
const REFRESH_TOKEN_KEY = 'mp_refresh_token';

function decodeJwt(token: string): TokenPayload | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function isExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return false; // assume valid if no exp
  const nowSec = Math.floor(Date.now() / 1000);
  return nowSec >= payload.exp;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Track access token changes to derive roles reactively
  private tokenSubject = new BehaviorSubject<string | null>(this.accessToken);
  roles$ = this.tokenSubject.asObservable().pipe(
    map((token) => {
      const payload = token ? decodeJwt(token) : null;
      const roles = payload?.roles || (payload?.role ? [payload.role] : []);
      return roles.map((r) => String(r).toUpperCase());
    })
  );

  get accessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  get roles(): string[] {
    const token = this.accessToken;
    const payload = token ? decodeJwt(token) : null;
    return payload?.roles || (payload?.role ? [payload.role] : []);
  }

  isAuthenticated(): boolean {
    const token = this.accessToken;
    if (!token) return false;
    return !isExpired(token);
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', { username, password }).pipe(
      tap((res) => this.handleAuthSuccess(res))
    );
  }

  register(data: { username: string; email: string; password: string; role?: string; firstName?: string; lastName?: string; phone?: string; }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', data).pipe(
      tap((res) => this.handleAuthSuccess(res))
    );
  }

  logout(callApi = true): Observable<void> {
    const refreshToken = this.refreshToken;
    this.clearSession();
    if (callApi && refreshToken) {
      return this.http.post<void>('/api/auth/logout', { refreshToken });
    }
    return of(void 0);
  }

  refresh(): Observable<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.refreshToken;
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      '/api/auth/refresh',
      { refreshToken }
    ).pipe(
      tap((res) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
        this.tokenSubject.next(res.accessToken);
      })
    );
  }

  getProfile(): Observable<{ user: AuthUser }> {
    return this.http.get<{ user: AuthUser }>('/api/auth/profile').pipe(
      tap(({ user }) => this.currentUserSubject.next(user))
    );
  }

  requestPasswordReset(email: string): Observable<{ message: string; resetUrl?: string }> {
    return this.http.post<{ message: string; resetUrl?: string }>(
      '/api/auth/forgot-password',
      { email }
    );
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      '/api/auth/reset-password',
      { token, newPassword }
    );
  }

  private handleAuthSuccess(res: AuthResponse) {
    localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    this.currentUserSubject.next(res.user);
    this.tokenSubject.next(res.accessToken);
  }

  private clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }
}
