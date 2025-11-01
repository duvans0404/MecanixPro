import { Component, OnInit, ViewEncapsulation, Renderer2, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { DataService } from './services/data.service';
import { SidebarComponent } from './components/navigation/sidebar.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { SidebarAdminComponent } from './components/navigation/sidebar-admin.component';
import { SidebarManagerComponent } from './components/navigation/sidebar-manager.component';
import { SidebarMechanicComponent } from './components/navigation/sidebar-mechanic.component';
import { SidebarReceptionistComponent } from './components/navigation/sidebar-receptionist.component';
import { SidebarClientComponent } from './components/navigation/sidebar-client.component';
import { GlobalModalsComponent } from './components/shared/global-modals.component';

import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule, RouterOutlet, CommonModule, SidebarComponent,
    SidebarAdminComponent, SidebarManagerComponent, SidebarMechanicComponent, SidebarReceptionistComponent, SidebarClientComponent,
    ConfirmDialogModule, GlobalModalsComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css', './app-modern.css', '../styles.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'MecanixPro';
  stats: any = {};
  mobileMenuOpen = false;
  isDarkMode = false;
  sidebarCollapsed = false;
  currentUser: { username?: string; firstName?: string; lastName?: string } | null = null;

  constructor(
    private dataService: DataService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStats();
    this.initializeTheme();
    this.initializeKeyboardShortcuts();
    if (this.auth.isAuthenticated()) {
      this.auth.getProfile().subscribe();
    }
    this.auth.currentUser$.subscribe((u) => (this.currentUser = u));
  }

  loadStats() {
    this.dataService.getTotalClientes().subscribe((total: any) => this.stats.totalClientes = total);
    this.dataService.getTotalVehiculos().subscribe((total: any) => this.stats.totalVehiculos = total);
    this.dataService.getOrdenesPendientes().subscribe((total: any) => this.stats.ordenesPendientes = total);
    this.dataService.getOrdenesCompletadas().subscribe((total: any) => this.stats.ordenesCompletadas = total);
    this.dataService.getTotalServicios().subscribe((total: any) => this.stats.totalServicios = total);
    this.dataService.getTotalRepuestos().subscribe((total: any) => this.stats.totalRepuestos = total);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  initializeTheme() {
    // Verificar si hay una preferencia guardada en localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = prefersDark;
    }
    
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDarkMode) {
      this.renderer.setAttribute(this.document.documentElement, 'data-theme', 'dark');
    } else {
      this.renderer.removeAttribute(this.document.documentElement, 'data-theme');
    }
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

  get isAuthRoute(): boolean {
    const path = this.router.url.split('?')[0];
    return path === '/login' || path === '/register';
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
    const roles = this.auth.roles;
    return roles && roles.length ? roles[0] : undefined;
  }

  get roles(): string[] {
    return this.auth.roles || [];
  }

  roleBadgeClass(role: string): string {
    const key = String(role || '').toUpperCase();
    return `role-badge--${key}`;
  }

  private rolePriority(role: string): number {
    const order = ['ADMIN', 'MANAGER', 'MECHANIC', 'RECEPTIONIST', 'CLIENT'];
    const idx = order.indexOf(String(role).toUpperCase());
    return idx === -1 ? 999 : idx;
  }

  // Return unique, sorted roles by priority
  get sortedRoles(): string[] {
    const roles = (this.auth.roles || []).map(r => String(r).toUpperCase());
    const unique = Array.from(new Set(roles));
    return unique.sort((a, b) => this.rolePriority(a) - this.rolePriority(b));
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
}