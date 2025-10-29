import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'sidebar-receptionist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-receptionist.component.html',
  styleUrls: ['./sidebar-receptionist.component.css']
})
export class SidebarReceptionistComponent implements OnInit {
  @Input() isCollapsed = false;
  private menuItems = [
    { title: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { title: 'Órdenes de Trabajo', icon: 'pi pi-briefcase', route: '/work-orders' },
    { title: 'Clientes', icon: 'pi pi-users', route: '/clients' },
    { title: 'Citas', icon: 'pi pi-calendar', route: '/appointments' },
    { title: 'Pagos', icon: 'pi pi-credit-card', route: '/payments' }
  ];

  visibleMenu: any[] = [];

  constructor(private auth: AuthService, private perms: PermissionsService) {}

  ngOnInit(): void {
    const build = (roles: string[]) => {
      this.visibleMenu = this.menuItems.filter((i) => this.perms.canAccess(i.route, roles));
    };
    build(this.auth.roles.map((r) => String(r).toUpperCase()));
    this.auth.roles$.subscribe(build);
  }
}
