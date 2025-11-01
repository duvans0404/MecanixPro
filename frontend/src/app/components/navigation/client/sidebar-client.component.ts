import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PermissionsService } from '../../../core/services/permissions.service';

@Component({
  selector: 'sidebar-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-client.component.html',
  styleUrls: ['./sidebar-client.component.css']
})
export class SidebarClientComponent implements OnInit {
  @Input() isCollapsed = false;
  private menuItems = [
    { title: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { title: 'Mis Vehículos', icon: 'pi pi-car', route: '/vehicles' },
    { title: 'Mis Citas', icon: 'pi pi-calendar', route: '/appointments' },
    { title: 'Mis Órdenes', icon: 'pi pi-briefcase', route: '/work-orders' },
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
