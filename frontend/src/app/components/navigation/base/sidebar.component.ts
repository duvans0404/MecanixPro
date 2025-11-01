import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/services/auth.service';
import { PermissionsService } from '../../../core/services/permissions.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, PanelMenuModule, AvatarModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  activeRoute = '';

  private menuItems = [
    {
      title: 'Dashboard',
      icon: 'pi pi-chart-line',
      route: '/dashboard',
      color: 'text-blue-600'
    },
    {
      title: 'Clientes',
      icon: 'pi pi-users',
      route: '/clients',
      color: 'text-blue-600',
      children: [
        { title: 'Ver Clientes', route: '/clients', icon: 'pi pi-list' },
        { title: 'Nuevo Cliente', route: '/clients/create', icon: 'pi pi-plus' }
      ]
    },
    {
      title: 'Vehículos',
      icon: 'pi pi-car',
      route: '/vehicles',
      color: 'text-green-600',
      children: [
        { title: 'Ver Vehículos', route: '/vehicles', icon: 'pi pi-list' },
        { title: 'Nuevo Vehículo', route: '/vehicles/create', icon: 'pi pi-plus' }
      ]
    },
    {
      title: 'Citas',
      icon: 'pi pi-calendar',
      route: '/appointments',
      color: 'text-indigo-600',
      children: [
        { title: 'Ver Citas', route: '/appointments', icon: 'pi pi-list' },
        { title: 'Nueva Cita', route: '/appointments/create', icon: 'pi pi-plus' }
      ]
    },
    {
      title: 'Órdenes de Trabajo',
      icon: 'pi pi-file-edit',
      route: '/work-orders',
      color: 'text-orange-600',
      children: [
        { title: 'Ver Órdenes', route: '/work-orders', icon: 'pi pi-list' },
        { title: 'Nueva Orden', route: '/work-orders/create', icon: 'pi pi-plus' }
      ]
    },
    {
      title: 'Servicios',
      icon: 'pi pi-wrench',
      route: '/services',
      color: 'text-yellow-600',
      children: [
        { title: 'Ver Servicios', route: '/services', icon: 'pi pi-list' },
        { title: 'Nuevo Servicio', route: '/services/create', icon: 'pi pi-plus' }
      ]
    },
    {
      title: 'Repuestos',
      icon: 'pi pi-box',
      route: '/parts',
      color: 'text-purple-600',
      children: [
        { title: 'Ver Repuestos', route: '/parts', icon: 'pi pi-list' },
        { title: 'Nuevo Repuesto', route: '/parts/create', icon: 'pi pi-plus' }
      ]
    },
    {
      title: 'Mecánicos',
      icon: 'pi pi-users',
      route: '/mechanics',
      color: 'text-rose-600',
      children: [
        { title: 'Ver Mecánicos', route: '/mechanics', icon: 'pi pi-list' },
        { title: 'Nuevo Mecánico', route: '/mechanics/create', icon: 'pi pi-plus' }
      ]
    },
    {
      title: 'Seguros',
      icon: 'pi pi-shield',
      route: '/insurance',
      color: 'text-cyan-600',
      children: [
        { title: 'Ver Seguros', route: '/insurance', icon: 'pi pi-list' },
        { title: 'Nuevo Seguro', route: '/insurance/create', icon: 'pi pi-plus' }
      ]
    },
    {
      title: 'Pagos',
      icon: 'pi pi-credit-card',
      route: '/payments',
      color: 'text-lime-600',
      children: [
        { title: 'Ver Pagos', route: '/payments', icon: 'pi pi-list' },
        { title: 'Nuevo Pago', route: '/payments/create', icon: 'pi pi-plus' }
      ]
    }
  ];

  visibleMenu: any[] = [];

  constructor(private router: Router, private auth: AuthService, private perms: PermissionsService) {}

  ngOnInit() {
    this.activeRoute = this.router.url;
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
      // Rebuild on navigation in case token/roles changed
      this.buildVisibleMenu(this.auth.roles.map((r) => String(r).toUpperCase()));
    });

    // React to role changes (login, refresh, logout)
    this.auth.roles$.subscribe((roles) => {
      this.buildVisibleMenu(roles);
    });

    // Initial build
    this.buildVisibleMenu(this.auth.roles.map((r) => String(r).toUpperCase()));
  }

  private buildVisibleMenu(roles: string[]) {
    this.visibleMenu = this.menuItems
      .map((item) => ({
        ...item,
        children: item.children?.filter((c: any) => this.perms.canAccess(c.route, roles)) || []
      }))
      .filter((item) => this.perms.canAccess(item.route, roles) || (item.children && item.children.length > 0));
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  isActive(route: string): boolean {
    return this.activeRoute === route || this.activeRoute.startsWith(route + '/');
  }

  hasChildren(item: any): boolean {
    return item.children && item.children.length > 0;
  }
}
