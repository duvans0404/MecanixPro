import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../shared/models/client.model';
import { TagSeverity } from '../../../shared/models/ui.model';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-clients-getall',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule
  ],
  
  templateUrl: './clients-getall.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ClientsGetallComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  loading: boolean = false;

  statusOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' }
  ];

  constructor(
    private clientService: ClientService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (clients: any[]) => {
        this.clients = clients;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error cargando clientes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los clientes'
        });
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredClients = this.clients.filter(client => {
      const matchesSearch = !this.searchTerm || 
        client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.phone.includes(this.searchTerm);
      
      const matchesStatus = this.statusFilter === 'all' || 
        (this.statusFilter === 'active' && client.active) ||
        (this.statusFilter === 'inactive' && !client.active);
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  viewClient(client: Client) {
    const config = ModalService.formatClientData(client);
    
    this.modalService.openViewModal(config, {
      onEdit: () => {
        this.modalService.closeViewModal();
        this.editClient(client);
      },
      onDelete: () => {
        this.modalService.closeViewModal();
        this.confirmDeleteClient(client);
      }
    });
  }

  editClient(client: Client) {
    this.router.navigate(['/clients/update', client.id]);
  }

  confirmDeleteClient(client: Client) {
    this.modalService.openDeleteModal(
      {
        title: '¿Eliminar Cliente?',
        message: 'Esta acción no se puede deshacer. El cliente y toda su información serán eliminados permanentemente.',
        itemName: client.name,
        itemLabel: 'Cliente a eliminar:',
        showWarning: true,
        warningMessage: '⚠️ Se eliminarán también todos los vehículos, citas y órdenes de trabajo asociados a este cliente.'
      },
      async () => {
        try {
          await this.clientService.deleteClient(client.id.toString()).toPromise();
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Cliente eliminado correctamente',
            life: 3000
          });
          this.loadClients();
        } catch (error) {
          console.error('Error eliminando cliente:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el cliente',
            life: 3000
          });
          throw error; // Re-throw para que el modal maneje el error
        }
      }
    );
  }

  deleteClient(client: Client) {
    // Método antiguo mantenido por compatibilidad
    this.confirmDeleteClient(client);
  }

  createClient() {
    this.router.navigate(['/clients/create']);
  }

  getStatusSeverity(active: boolean): TagSeverity {
    return active ? 'success' : 'danger';
  }

  getStatusLabel(active: boolean): string {
    return active ? 'Activo' : 'Inactivo';
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.onSearch();
  }
}
