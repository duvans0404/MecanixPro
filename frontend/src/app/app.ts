import { Component, OnInit, ViewEncapsulation, Renderer2, Inject } from '@angular/core';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { DataService } from './services/data.service';
import { ThemeService } from './services/theme.service';
import { LoadingService } from './services/loading.service';
import { SidebarComponent } from './components/navigation/sidebar.component';
import { AuthService } from './services/auth.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { SidebarAdminComponent } from './components/navigation/sidebar-admin.component';
import { SidebarManagerComponent } from './components/navigation/sidebar-manager.component';
import { SidebarMechanicComponent } from './components/navigation/sidebar-mechanic.component';
import { SidebarReceptionistComponent } from './components/navigation/sidebar-receptionist.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarClientComponent } from './components/navigation/sidebar-client.component';
import { GlobalModalsComponent } from './components/shared/global-modals.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule, RouterOutlet, CommonModule, SidebarComponent,
    SidebarAdminComponent, SidebarManagerComponent, SidebarMechanicComponent, SidebarReceptionistComponent, SidebarClientComponent,
    ConfirmDialogModule, GlobalModalsComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css', './app-modern.css', './debug-theme.css', '../styles.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'translateY(8px)' }),
            animate('260ms cubic-bezier(.2,.7,.2,1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ], { optional: true }),
          query(':leave', [
            style({ opacity: 1, transform: 'translateY(0)' }),
            animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-6px)' }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'MecanixPro';
  stats: any = {};
  mobileMenuOpen = false;
  isDarkMode = false;
  sidebarCollapsed = false;
  currentUser: { username?: string; firstName?: string; lastName?: string } | null = null;
  isNavigating = false;
  private navStartAt = 0;
  private navStopTimer: any = null;
  loadingMessage = 'Cargando…';
  private readonly segmentTitleMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'clients': 'Clientes',
    'vehicles': 'Vehículos',
    'services': 'Servicios',
    'parts': 'Repuestos',
    'appointments': 'Citas',
    'insurance': 'Seguros',
    'mechanics': 'Mecánicos',
    'payments': 'Pagos',
    'work-orders': 'Órdenes de Trabajo',
    'login': 'Inicio de sesión',
    'register': 'Registro'
  };

  constructor(
    private dataService: DataService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private auth: AuthService,
    private router: Router,
    private themeService: ThemeService,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadStats();
    // El tema se inicializa automáticamente en el servicio
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.initializeKeyboardShortcuts();
    
    // Suscribirse a cambios en el usuario actual
    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    if (this.auth.isAuthenticated()) {
      this.auth.getProfile().subscribe({
        next: ({ user }) => {
          this.currentUser = user;
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
        }
      });
    }

    // Barra de progreso durante navegación de rutas
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingMessage = `Cargando… ${this.formatUrlTitle(event.url)}`;
        this.document.title = `MecanixPro — ${this.loadingMessage}`;
        this.setNavigating(true);
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        const url = event instanceof NavigationEnd ? event.urlAfterRedirects : this.router.url;
        const title = this.formatUrlTitle(url);
        this.document.title = `MecanixPro — ${title}`;
        this.setNavigating(false);
      }
    });
  }

  // Métodos de tema ahora usan el servicio
  get isDarkModeFromService(): boolean {
    return this.themeService.isDarkMode;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  loadStats() {
    this.dataService.getTotalClientes().subscribe(total => this.stats.totalClientes = total);
    this.dataService.getTotalVehiculos().subscribe(total => this.stats.totalVehiculos = total);
    this.dataService.getOrdenesPendientes().subscribe(total => this.stats.ordenesPendientes = total);
    this.dataService.getOrdenesCompletadas().subscribe(total => this.stats.ordenesCompletadas = total);
    this.dataService.getTotalServicios().subscribe(total => this.stats.totalServicios = total);
    this.dataService.getTotalRepuestos().subscribe(total => this.stats.totalRepuestos = total);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  initializeKeyboardShortcuts() {
    this.document.addEventListener('keydown', (event: KeyboardEvent) => {
      // Ctrl/Cmd + K para focus en search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = this.document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Escape para cerrar mobile menu
      if (event.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  openQuickCreate() {
    // Implementar lógica para abrir modal de creación rápida
    console.log('Opening quick create modal...');
  }

  openNotifications() {
    // Implementar lógica para abrir panel de notificaciones
    console.log('Opening notifications panel...');
  }

  openProfileMenu() {
    // Implementar lógica para abrir menú de perfil
    console.log('Opening profile menu...');
  }

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  prepareRoute(outlet: RouterOutlet): string | null {
    if (!outlet || !outlet.isActivated || !outlet.activatedRoute) {
      return null;
    }
    const data = outlet.activatedRouteData?.['animation'] as string | undefined;
    if (data) return data;
    const url = outlet.activatedRoute.snapshot?.url?.map(s => s.path).join('/') ?? null;
    return url;
  }

  private setNavigating(active: boolean) {
    const minDurationMs = 2000;
    if (active) {
      this.navStartAt = Date.now();
      if (this.navStopTimer) {
        clearTimeout(this.navStopTimer);
        this.navStopTimer = null;
      }
      this.isNavigating = true;
      return;
    }
    // stop with minimum visible time
    const elapsed = Date.now() - this.navStartAt;
    const remaining = Math.max(0, minDurationMs - elapsed);
    if (remaining === 0) {
      this.isNavigating = false;
    } else {
      this.navStopTimer = setTimeout(() => {
        this.isNavigating = false;
        this.navStopTimer = null;
      }, remaining);
    }
  }

  private formatUrlTitle(url: string): string {
    try {
      const clean = (url || '/').split('?')[0].replace(/^\//, '');
      if (!clean) return 'inicio';
      const parts = clean
        .split('/')
        .map(seg => seg.trim());
      const mappedFirst = this.segmentTitleMap[parts[0]];
      if (mappedFirst) {
        const rest = parts.slice(1).map(seg => seg.replace(/[-_]/g, ' ')).map(seg => seg.charAt(0).toUpperCase() + seg.slice(1));
        return [mappedFirst, ...rest].join(' › ');
      }
      return parts
        .map(seg => seg.replace(/[-_]/g, ' '))
        .map(seg => seg.charAt(0).toUpperCase() + seg.slice(1))
        .join(' › ');
    } catch {
      return '';
    }
  }

  get isAuthRoute(): boolean {
    const path = this.router.url.split('?')[0];
    return path === '/login' || path === '/register' || path === '/forgot-password' || path === '/reset-password';
  }

  logout() {
    this.auth.logout().subscribe({
      complete: () => this.router.navigate(['/login'])
    });
  }

  get displayName(): string | undefined {
    const u = this.currentUser;
    if (!u) return undefined;
    if (u.firstName || u.lastName) {
      return [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
    }
    return u.username;
  }

  get displayRole(): string | undefined {
    const roles = this.getEffectiveRoles();
    return roles && roles.length ? roles[0] : undefined;
  }

  get roles(): string[] {
    return this.getEffectiveRoles();
  }

  private rolePriority(role: string): number {
    const order = ['ADMIN', 'MANAGER', 'MECHANIC', 'RECEPTIONIST', 'CLIENT'];
    const idx = order.indexOf(String(role).toUpperCase());
    return idx === -1 ? 999 : idx;
  }

  // Return unique, sorted roles by priority
  get sortedRoles(): string[] {
    const roles = this.getEffectiveRoles().map(r => String(r).toUpperCase());
    const unique = Array.from(new Set(roles));
    return unique.sort((a, b) => this.rolePriority(a) - this.rolePriority(b));
  }

  /**
   * Preferir roles del perfil (servidor) para reflejar cambios en BD sin relogin.
   * Si no hay perfil aún, usar roles del token como respaldo.
   */
  private getEffectiveRoles(): string[] {
    const u = this.currentUser as any;
    // Intentar desde perfil: puede venir como strings o como objetos {id, name}
    if (u && (u.roles || u.role)) {
      const raw = (u.roles as any[] | undefined) || (u.role ? [u.role] : []);
      const names = raw
        .map((r: any) => typeof r === 'string' ? r : r?.name)
        .filter((v: any) => !!v)
        .map((v: string) => v.toUpperCase());
      if (names.length) return names;
    }
    // Respaldo: roles desde el token JWT
    return (this.auth.roles || []).map(r => String(r).toUpperCase());
  }

  roleTitle(role: string): string {
    const key = String(role || '').toUpperCase();
    switch (key) {
      case 'ADMIN': return 'Administrador: acceso total al sistema';
      case 'MANAGER': return 'Manager: gestión y supervisión avanzada';
      case 'MECHANIC': return 'Mecánico: ejecución de órdenes y diagnósticos';
      case 'RECEPTIONIST': return 'Recepcionista: atención y registro';
      case 'CLIENT': return 'Cliente: acceso a su información y estados';
      default: return key;
    }
  }

  roleBadgeClass(role: string): string {
    const key = String(role || '').toUpperCase();
    return `role-badge--${key}`;
  }
}