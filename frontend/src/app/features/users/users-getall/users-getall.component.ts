import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { UserService, User } from '../../../core/services/user.service';
import { TagSeverity } from '../../../shared/models/ui.model';
import { ModalService } from '../../../core/services/modal.service';

const USER_ROLES = ['ADMIN', 'MANAGER', 'MECHANIC', 'RECEPTIONIST', 'CLIENT'];

@Component({
  selector: 'app-users-getall',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ToastModule,
    TagModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './users-getall.component.html',
  styleUrls: ['./users-getall.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsersGetallComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  roleFilter: string = 'all';
  loading: boolean = false;

  roleOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Manager', value: 'MANAGER' },
    { label: 'Mecánico', value: 'MECHANIC' },
    { label: 'Recepcionista', value: 'RECEPTIONIST' },
    { label: 'Cliente', value: 'CLIENT' }
  ];

  availableRoles = USER_ROLES.map(role => ({ label: role, value: role }));

  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error cargando usuarios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los usuarios'
        });
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.firstName && user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onRoleFilterChange() {
    this.applyFilters();
  }

  getCurrentRole(user: User): string {
    return user.role || (user.roles && user.roles.length > 0 ? user.roles[0] : 'CLIENT');
  }

  onChangeRole(user: User, newRole: string) {
    if (newRole === this.getCurrentRole(user)) {
      return; // No cambiar si es el mismo rol
    }

    const currentRoleLabel = this.getRoleLabel(this.getCurrentRole(user));
    const newRoleLabel = this.getRoleLabel(newRole);

    this.modalService.openDeleteModal(
      {
        title: '¿Cambiar Rol de Usuario?',
        message: `Estás a punto de cambiar el rol del usuario "${this.getDisplayName(user)}" (@${user.username}).`,
        itemName: `${currentRoleLabel} → ${newRoleLabel}`,
        itemLabel: 'Cambio de rol:',
        showWarning: true,
        warningMessage: `⚠️ El usuario perderá los permisos de "${currentRoleLabel}" y obtendrá los permisos de "${newRoleLabel}". Esta acción afectará el acceso del usuario al sistema.`,
        confirmText: 'Sí, cambiar rol',
        confirmIcon: 'pi pi-refresh',
        loadingText: 'Cambiando rol...'
      },
      async () => {
        try {
          await this.updateUserRole(user, newRole);
        } catch (error) {
          console.error('Error cambiando rol:', error);
          throw error; // Re-throw para que el modal maneje el error
        }
      }
    );
  }

  updateUserRole(user: User, newRole: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.userService.updateUserRole(user.id, newRole).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: `Rol cambiado a ${this.getRoleLabel(newRole)} correctamente`,
            life: 3000
          });
          this.loadUsers(); // Recargar lista
          this.loading = false;
          resolve();
        },
        error: (error: any) => {
          console.error('Error cambiando rol:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al cambiar el rol del usuario',
            life: 3000
          });
          this.loading = false;
          reject(error);
        }
      });
    });
  }

  getRoleSeverity(role: string): TagSeverity {
    const roleUpper = role.toUpperCase();
    switch (roleUpper) {
      case 'ADMIN':
        return 'danger';
      case 'MANAGER':
        return 'warn';
      case 'MECHANIC':
        return 'info';
      case 'RECEPTIONIST':
        return 'success';
      case 'CLIENT':
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  getRoleLabel(role: string): string {
    const roleUpper = role.toUpperCase();
    switch (roleUpper) {
      case 'ADMIN':
        return 'Administrador';
      case 'MANAGER':
        return 'Gerente';
      case 'MECHANIC':
        return 'Mecánico';
      case 'RECEPTIONIST':
        return 'Recepcionista';
      case 'CLIENT':
        return 'Cliente';
      default:
        return role;
    }
  }

  getStatusSeverity(isActive: boolean): TagSeverity {
    return isActive ? 'success' : 'danger';
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Activo' : 'Inactivo';
  }

  getDisplayName(user: User): string {
    if (user.firstName || user.lastName) {
      return [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    }
    return user.username;
  }

  clearFilters() {
    this.searchTerm = '';
    this.roleFilter = 'all';
    this.onSearch();
  }
}

