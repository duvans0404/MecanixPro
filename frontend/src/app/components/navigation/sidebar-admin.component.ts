import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'sidebar-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent implements OnInit {
  @Input() isCollapsed = false;
  private menuItems = [
    { title: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { title: 'Órdenes de Trabajo', icon: 'pi pi-briefcase', route: '/work-orders' },
    { title: 'Clientes', icon: 'pi pi-users', route: '/clients' },
    { title: 'Vehículos', icon: 'pi pi-car', route: '/vehicles' },
    { title: 'Citas', icon: 'pi pi-calendar', route: '/appointments' },
    { title: 'Servicios', icon: 'pi pi-wrench', route: '/services' },
    { title: 'Repuestos', icon: 'pi pi-box', route: '/parts' },
    { title: 'Mecánicos', icon: 'pi pi-users', route: '/mechanics' },
    { title: 'Seguros', icon: 'pi pi-shield', route: '/insurance' },
    { title: 'Pagos', icon: 'pi pi-credit-card', route: '/payments' },
    { title: 'Usuarios', icon: 'pi pi-user-edit', route: '/users' }
  ];

  visibleMenu: any[] = [];

  constructor(private auth: AuthService, private perms: PermissionsService) {}

  ngOnInit(): void {
    // Build initially and react to role changes
    const build = (roles: string[]) => {
      this.visibleMenu = this.menuItems.filter((i) => this.perms.canAccess(i.route, roles));
    };
    build(this.auth.roles.map((r) => String(r).toUpperCase()));
    this.auth.roles$.subscribe(build);
  }
}
