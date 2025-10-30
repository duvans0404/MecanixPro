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
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service.model';
import { TagSeverity } from '../../../models/ui.model';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-services-getall',
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
  
  templateUrl: './services-getall.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ServicesGetallComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  categoryFilter: string = 'all';
  loading: boolean = false;

  statusOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' }
  ];

  categoryOptions: { label: string, value: string }[] = [
    { label: 'Todas las categorías', value: 'all' }
  ];

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los servicios'
        });
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredServices = this.services.filter(service => {
      const matchesSearch = !this.searchTerm || 
        service.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || 
        (this.statusFilter === 'active' && service.active) ||
        (this.statusFilter === 'inactive' && !service.active);
      
      const matchesCategory = this.categoryFilter === 'all' || 
        service.category === this.categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onCategoryFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.categoryFilter = 'all';
    this.applyFilters();
  }

  editService(service: Service) {
    this.router.navigate(['/services/update', service.id]);
  }

  deleteService(service: Service) {
    this.modalService.openDeleteModal(
      {
        title: '¿Eliminar Servicio?',
        message: 'Esta acción no se puede deshacer. El servicio será eliminado permanentemente.',
        itemName: service.name,
        itemLabel: 'Servicio a eliminar:',
        showWarning: true,
        warningMessage: '⚠️ Se eliminarán también todas las citas y órdenes de trabajo que usen este servicio.'
      },
      async () => {
        try {
          await this.serviceService.deleteService(service.id).toPromise();
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Servicio eliminado correctamente',
            life: 3000
          });
          this.loadServices();
        } catch (error) {
          console.error('Error eliminando servicio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el servicio',
            life: 3000
          });
          throw error; // Re-throw para que el modal maneje el error
        }
      }
    );
  }

  createService() {
    this.router.navigate(['/services/create']);
  }

  getStatusSeverity(active: boolean): TagSeverity {
    return active ? 'success' : 'danger';
  }

  getStatusLabel(active: boolean): string {
    return active ? 'Activo' : 'Inactivo';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}
