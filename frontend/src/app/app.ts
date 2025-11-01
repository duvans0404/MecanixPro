import { Component, OnInit, ViewEncapsulation, Renderer2, Inject, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { DataService } from './core/services/data.service';
import { ThemeService } from './core/services/theme.service';
import { LoadingService } from './core/services/loading.service';
import { SidebarComponent } from './components/navigation/base/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { SidebarAdminComponent } from './components/navigation/admin/sidebar-admin.component';
import { SidebarManagerComponent } from './components/navigation/manager/sidebar-manager.component';
import { SidebarMechanicComponent } from './components/navigation/mechanic/sidebar-mechanic.component';
import { SidebarReceptionistComponent } from './components/navigation/receptionist/sidebar-receptionist.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarClientComponent } from './components/navigation/client/sidebar-client.component';
import { GlobalModalsComponent } from './shared/components/global-modals.component';

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
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'MecanixPro';
  stats: any = {};
  mobileMenuOpen = false;
  isDarkMode = false;
  sidebarCollapsed = true; // Colapsado por defecto, se expande con hover
  isMobile = false;
  currentUser: { username?: string; firstName?: string; lastName?: string } | null = null;
  isNavigating = false;
  private navStartAt = 0;
  private navStopTimer: any = null;
  loadingMessage = 'Cargando…';
  private profileLoaded = false; // Bandera para saber si el perfil ya se cargó
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

  routeAnimationState: string | null = null;

  constructor(
    private dataService: DataService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private auth: AuthService,
    private router: Router,
    private themeService: ThemeService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

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

  checkMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSidebar() {
    // En móvil, toggle abre/cierra el sidebar
    if (this.isMobile) {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      // Agregar/quitar clase para el overlay
      const layout = document.querySelector('.modern-app-layout');
      if (layout) {
        if (!this.sidebarCollapsed) {
          layout.classList.add('sidebar-open');
        } else {
          layout.classList.remove('sidebar-open');
        }
      }
    } else {
      // En desktop, toggle colapsa/expande
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  ngOnInit() {
    this.checkMobile();
    // Actualizar isMobile en resize
    window.addEventListener('resize', () => this.checkMobile());
    
    // Inicializar el estado de animación de ruta con la ruta actual
    const currentPath = this.router.url.split('?')[0].replace(/^\//, '') || null;
    this.routeAnimationState = currentPath;
    
    this.loadStats();
    // El tema se inicializa automáticamente en el servicio
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.initializeKeyboardShortcuts();
    
    // Suscribirse a cambios en el usuario actual
    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Si el perfil ya se cargó, marcar como cargado
      if (user && !this.profileLoaded) {
        this.profileLoaded = true;
      }
    });
    
    if (this.auth.isAuthenticated()) {
      this.profileLoaded = false; // Resetear la bandera antes de cargar
      this.auth.getProfile().subscribe({
        next: ({ user }) => {
          console.log('👤 [AppComponent] Perfil de usuario recibido:', user);
          console.log('👤 [AppComponent] Roles del usuario:', (user as any).roles || (user as any).role);
          this.currentUser = user;
          this.profileLoaded = true; // Marcar que el perfil se cargó
          // Forzar detección de cambios después de actualizar el usuario
          this.cdr.detectChanges();
          // Log después de la detección de cambios
          setTimeout(() => {
            console.log('✅ [AppComponent] Usuario actualizado. displayRole:', this.displayRole);
          }, 0);
        },
        error: (error) => {
          console.error('❌ [AppComponent] Error loading user profile:', error);
          // Si falla, permitir usar el token como fallback después de un delay
          setTimeout(() => {
            this.profileLoaded = true;
            this.cdr.detectChanges();
          }, 1000);
        }
      });
    }

    // Barra de progreso durante navegación de rutas
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingMessage = `Cargando… ${this.formatUrlTitle(event.url)}`;
        this.document.title = `MecanixPro — ${this.loadingMessage}`;
        this.setNavigating(true);
        // Cerrar sidebar en móvil al navegar
        if (this.isMobile && !this.sidebarCollapsed) {
          this.sidebarCollapsed = true;
          const layout = this.document.querySelector('.modern-app-layout');
          if (layout) {
            layout.classList.remove('sidebar-open');
          }
        }
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        const url = event instanceof NavigationEnd ? event.urlAfterRedirects : this.router.url;
        const title = this.formatUrlTitle(url);
        this.document.title = `MecanixPro — ${title}`;
        this.setNavigating(false);
        // Actualizar animación de ruta de forma asíncrona para evitar ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.updateRouteAnimation();
          this.cdr.detectChanges();
        }, 0);
      }
    });
    
    // Cerrar sidebar con Escape key (solo en móvil)
    this.document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.isMobile && !this.sidebarCollapsed) {
        this.sidebarCollapsed = true;
        const layout = this.document.querySelector('.modern-app-layout');
        if (layout) {
          layout.classList.remove('sidebar-open');
        }
      }
    });
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
    // Usar el valor almacenado si está disponible para evitar cambios durante la verificación
    if (this.routeAnimationState !== null) {
      return this.routeAnimationState;
    }
    
    if (!outlet || !outlet.isActivated || !outlet.activatedRoute) {
      return null;
    }
    
    const data = outlet.activatedRouteData?.['animation'] as string | undefined;
    if (data) {
      this.routeAnimationState = data;
      return data;
    }
    
    const url = outlet.activatedRoute.snapshot?.url?.map(s => s.path).join('/') ?? null;
    this.routeAnimationState = url;
    return url;
  }

  private updateRouteAnimation() {
    // Actualizar el estado de animación cuando cambia la ruta
    const outlet = this.router.url.split('?')[0].replace(/^\//, '') || 'dashboard';
    this.routeAnimationState = outlet;
  }

  ngAfterViewChecked() {
    // Evitar ExpressionChangedAfterItHasBeenCheckedError
    // No hacer cambios aquí, solo detectar si es necesario
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

  /**
   * Obtiene los roles directamente del backend (perfil o token), sin prioridad
   * Usa los roles tal como vienen del backend en el orden que vienen
   */
  get roles(): string[] {
    const u = this.currentUser as any;
    
    // Sin prioridad: usar los roles tal como vienen del backend
    // Primero intentar desde el array roles (relación many-to-many)
    if (u && u.roles && Array.isArray(u.roles) && u.roles.length > 0) {
      const names = u.roles
        .map((r: any) => {
          if (typeof r === 'string') {
            return r;
          }
          // Soporte para formato legacy (objetos)
          if (r && typeof r === 'object' && r.name) {
            return r.name;
          }
          return String(r);
        })
        .filter((v: any) => !!v && v !== 'undefined' && v !== 'null')
        .map((v: string) => String(v).toUpperCase());
      
      if (names.length) {
        console.log('🔍 [AppComponent] Roles desde perfil (relación):', names);
        return names;
      }
    }
    
    // Si no hay roles en la relación, usar el campo role como fallback
    if (u && u.role) {
      const roleStr = String(u.role).toUpperCase().trim();
      if (roleStr && roleStr !== 'UNDEFINED' && roleStr !== 'NULL') {
        console.log('🔍 [AppComponent] Rol desde campo role (fallback):', roleStr);
        return [roleStr];
      }
    }
    
    // Respaldo: roles desde el token JWT SOLO si el perfil ya se cargó o si no hay currentUser
    // Esto evita usar roles del token mientras el perfil se está cargando
    if (this.profileLoaded || !this.currentUser) {
      const tokenRoles = (this.auth.roles || []).map(r => String(r).toUpperCase());
      console.log('🔍 [AppComponent] Roles desde token (fallback):', tokenRoles);
      return tokenRoles;
    }
    
    // Si el perfil aún no se ha cargado, devolver array vacío para evitar mostrar rol incorrecto
    console.log('⏳ [AppComponent] Esperando carga del perfil...');
    return [];
  }

  /**
   * Obtiene el rol principal directamente del backend sin aplicar prioridad
   * Usa el primer rol que viene del perfil o token, en el orden que viene del backend
   */
  get displayRole(): string | undefined {
    const roles = this.roles;
    if (!roles || roles.length === 0) {
      console.warn('⚠️ [AppComponent] No se encontraron roles para el usuario');
      return undefined;
    }
    // Usar el primer rol que viene del backend, sin ordenar por prioridad
    const role = roles[0];
    console.log('🎯 [AppComponent] displayRole seleccionado:', role, 'de roles:', roles);
    return role;
  }

  get sortedRoles(): string[] {
    // Devolver roles tal como vienen del backend, sin ordenar por prioridad
    return this.roles;
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