import { Injectable } from '@angular/core';
import { routes } from '../app.routes';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private routeMap: Map<string, string[] | null> = new Map();

  constructor() {
    // Build a quick lookup from routes config
    for (const r of routes) {
      if (!r.path) continue;
      const key = r.path.replace(/^\//, '');
      const roles = (r.data && (r.data as any).roles) as string[] | undefined;
      this.routeMap.set(key, roles ? roles.map((x) => String(x).toUpperCase()) : null);
    }
  }

  /**
   * Returns allowed roles for a given path (e.g., '/clients/create').
   * If null, it means only authenticated users (no specific role restriction).
   * If undefined, no matching route was found.
   */
  getAllowedRolesForPath(path: string): string[] | null | undefined {
    const normalized = path.replace(/^\//, '');
    // direct match first
    if (this.routeMap.has(normalized)) return this.routeMap.get(normalized);

    // Try to resolve dynamic segments if any (very basic matching)
    for (const [routePath, roles] of this.routeMap.entries()) {
      if (this.matchStaticPrefix(routePath, normalized)) return roles;
    }
    return undefined;
  }

  /**
   * Checks if user roles can access a path. If route has no roles (null), any authenticated user can access.
   */
  canAccess(path: string, userRoles: string[]): boolean {
    const allowed = this.getAllowedRolesForPath(path);
    if (allowed === undefined) return true; // route not in map; assume visible
    if (allowed === null) return true; // only auth required
    const set = new Set(userRoles.map((r) => String(r).toUpperCase()));
    return allowed.some((r) => set.has(String(r).toUpperCase()));
  }

  private matchStaticPrefix(routePath: string, normalized: string): boolean {
    // e.g. routePath 'clients/update/:id' should match 'clients/update/123'
    const routeParts = routePath.split('/');
    const targetParts = normalized.split('/');
    if (routeParts.length !== targetParts.length) return false;
    for (let i = 0; i < routeParts.length; i++) {
      const rp = routeParts[i];
      const tp = targetParts[i];
      if (rp.startsWith(':')) continue;
      if (rp !== tp) return false;
    }
    return true;
  }
}
