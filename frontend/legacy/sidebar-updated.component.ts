import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  iconClass?: string;
  subtitle?: string;
  badge?: string | number;
  children?: MenuItem[];
  expanded?: boolean;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-modern.component.html',
  styleUrls: ['./sidebar-modern.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  currentRoute = '';
  roles: string[] = [];

  // Menú con roles permitidos
  private allPrimaryMenuItems: (MenuItem & { roles?: string[] })[] = [
    {
      title: 'Dashboard',
      subtitle: 'Vista general',
      icon: 'pi pi-home',
      iconClass: 'primary',
      route: '/dashboard',
      roles: ['ADMIN','MANAGER','MECHANIC','RECEPTIONIST','CLIENT']
    },
    {
      title: 'Órdenes de Trabajo',
      subtitle: 'Gestión activa',
      icon: 'pi pi-briefcase',
      iconClass: 'warning',
      route: '/work-orders',
      badge: '12',
      roles: ['ADMIN','MANAGER','MECHANIC','RECEPTIONIST']
    },
    {
      title: 'Citas',
      subtitle: 'Programación',
      icon: 'pi pi-calendar',
      iconClass: 'success',
      route: '/appointments',
      badge: '3',
      roles: ['ADMIN','MANAGER','RECEPTIONIST','CLIENT']
    }
  ];

  private allManagementMenuItems: (MenuItem & { roles?: string[] })[] = [
    {
      title: 'Clientes',
      subtitle: 'Base de datos',
      icon: 'pi pi-users',
      iconClass: 'primary',
      expanded: false,
      roles: ['ADMIN','MANAGER','RECEPTIONIST'],
      children: [
        { title: 'Todos los Clientes', icon: 'pi pi-list', route: '/clients', roles: ['ADMIN','MANAGER','RECEPTIONIST'] },
        { title: 'Nuevo Cliente', icon: 'pi pi-plus', route: '/clients/create', roles: ['ADMIN','MANAGER','RECEPTIONIST'] },
        { title: 'Clientes VIP', icon: 'pi pi-star', route: '/clients/vip', badge: '5', roles: ['ADMIN','MANAGER'] }
      ]
    },
    {
      title: 'Vehículos',
      subtitle: 'Inventario móvil',
      icon: 'pi pi-car',
      iconClass: 'teal',
      expanded: false,
      roles: ['ADMIN','MANAGER','RECEPTIONIST','CLIENT'],
      children: [
        { title: 'Todos los Vehículos', icon: 'pi pi-list', route: '/vehicles', roles: ['ADMIN','MANAGER','RECEPTIONIST','CLIENT'] },
        { title: 'Nuevo Vehículo', icon: 'pi pi-plus', route: '/vehicles/create', roles: ['ADMIN','MANAGER','RECEPTIONIST'] },
        { title: 'Historial de Servicio', icon: 'pi pi-history', route: '/vehicles/history', roles: ['ADMIN','MANAGER','RECEPTIONIST','CLIENT'] }
      ]
    },
    {
      title: 'Mecánicos',
      subtitle: 'Equipo técnico',
      icon: 'pi pi-wrench',
      iconClass: 'success',
      expanded: false,
      roles: ['ADMIN','MANAGER'],
      children: [
        { title: 'Todos los Mecánicos', icon: 'pi pi-list', route: '/mechanics', roles: ['ADMIN','MANAGER'] },
        { title: 'Nuevo Mecánico', icon: 'pi pi-plus', route: '/mechanics/create', roles: ['ADMIN','MANAGER'] },
        { title: 'Horarios', icon: 'pi pi-clock', route: '/mechanics/schedule', roles: ['ADMIN','MANAGER'] }
      ]
    },
    {
      title: 'Servicios',
      subtitle: 'Catálogo técnico',
      icon: 'pi pi-cog',
      iconClass: 'purple',
      expanded: false,
      roles: ['ADMIN','MANAGER','MECHANIC'],
      children: [
        { title: 'Todos los Servicios', icon: 'pi pi-list', route: '/services', roles: ['ADMIN','MANAGER','MECHANIC'] },
        { title: 'Nuevo Servicio', icon: 'pi pi-plus', route: '/services/create', roles: ['ADMIN','MANAGER'] },
        { title: 'Precios y Tarifas', icon: 'pi pi-dollar', route: '/services/pricing', roles: ['ADMIN','MANAGER'] }
      ]
    },
    {
      title: 'Repuestos',
      subtitle: 'Inventario físico',
      icon: 'pi pi-box',
      iconClass: 'warning',
      expanded: false,
      roles: ['ADMIN','MANAGER','MECHANIC'],
      children: [
        { title: 'Todos los Repuestos', icon: 'pi pi-list', route: '/parts', roles: ['ADMIN','MANAGER','MECHANIC'] },
        { title: 'Nuevo Repuesto', icon: 'pi pi-plus', route: '/parts/create', roles: ['ADMIN','MANAGER'] },
        { title: 'Stock Bajo', icon: 'pi pi-exclamation-triangle', route: '/parts/low-stock', badge: '8', roles: ['ADMIN','MANAGER'] }
      ]
    },
    {
      title: 'Pagos',
      subtitle: 'Control financiero',
      icon: 'pi pi-credit-card',
      iconClass: 'success',
      expanded: false,
      roles: ['ADMIN','MANAGER','RECEPTIONIST'],
      children: [
        { title: 'Todos los Pagos', icon: 'pi pi-list', route: '/payments', roles: ['ADMIN','MANAGER','RECEPTIONIST'] },
        { title: 'Nuevo Pago', icon: 'pi pi-plus', route: '/payments/create', roles: ['ADMIN','MANAGER','RECEPTIONIST'] },
        { title: 'Pendientes', icon: 'pi pi-clock', route: '/payments/pending', badge: '4', roles: ['ADMIN','MANAGER','RECEPTIONIST'] }
      ]
    },
    {
      title: 'Seguros',
      subtitle: 'Pólizas activas',
      icon: 'pi pi-shield',
      iconClass: 'danger',
      expanded: false,
      roles: ['ADMIN','MANAGER'],
      children: [
        { title: 'Todos los Seguros', icon: 'pi pi-list', route: '/insurance', roles: ['ADMIN','MANAGER'] },
        { title: 'Nuevo Seguro', icon: 'pi pi-plus', route: '/insurance/create', roles: ['ADMIN','MANAGER'] },
        { title: 'Por Vencer', icon: 'pi pi-exclamation-circle', route: '/insurance/expiring', badge: '2', roles: ['ADMIN','MANAGER'] }
      ]
    }
  ];

  private allReportsMenuItems: (MenuItem & { roles?: string[] })[] = [
    {
      title: 'Reportes Financieros',
      icon: 'pi pi-chart-line',
      iconClass: 'success',
      route: '/reports/financial',
      roles: ['ADMIN','MANAGER']
    },
    {
      title: 'Análisis de Rendimiento',
      icon: 'pi pi-chart-bar',
      iconClass: 'primary',
      route: '/reports/performance',
      roles: ['ADMIN','MANAGER']
    },
    {
      title: 'Estadísticas de Taller',
      icon: 'pi pi-chart-pie',
      iconClass: 'purple',
      route: '/reports/workshop',
      roles: ['ADMIN','MANAGER']
    }
  ];

  constructor(private router: Router, private auth: AuthService) {}

  // Filtrado de menús según roles
  get primaryMenuItems(): MenuItem[] {
    return this.allPrimaryMenuItems.filter(item => this.hasRole(item.roles));
  }
  get managementMenuItems(): MenuItem[] {
    // Filtra grupos y sus hijos
    return this.allManagementMenuItems
      .filter(item => this.hasRole(item.roles))
      .map(item => ({
        ...item,
        children: item.children?.filter(child => this.hasRole(child.roles)) || []
      }))
      .filter(item => !item.children || item.children.length > 0);
  }
  get reportsMenuItems(): MenuItem[] {
    return this.allReportsMenuItems.filter(item => this.hasRole(item.roles));
  }

  ngOnInit() {
    // Listen for route changes to update active states
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
    this.currentRoute = this.router.url;
    this.roles = this.auth.roles.map(r => r.toUpperCase());
  }

  hasRole(allowed?: string[]): boolean {
    if (!allowed || allowed.length === 0) return true;
    return this.roles.some(r => allowed.includes(r));
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleGroup(item: MenuItem) {
    if (!this.isCollapsed && item.children) {
      item.expanded = !item.expanded;
      
      // Close other expanded groups (optional - for accordion behavior)
      // this.managementMenuItems.forEach(menuItem => {
      //   if (menuItem !== item) {
      //     menuItem.expanded = false;
      //   }
      // });
    }
  }

  isActive(route: string | undefined): boolean {
    if (!route) return false;
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  onMenuItemClick(item: MenuItem) {
    if (item.route) {
      this.router.navigate([item.route]);
    } else if (this.hasChildren(item)) {
      this.toggleGroup(item);
    }
  }

  // Method to handle keyboard navigation
  onKeyDown(event: KeyboardEvent, item: MenuItem) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onMenuItemClick(item);
    }
  }
}