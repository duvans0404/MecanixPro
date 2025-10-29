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
import { WorkOrderService } from '../../../services/work-order.service';
import { ClientService } from '../../../services/client.service';
import { VehicleService } from '../../../services/vehicle.service';
import { MechanicService } from '../../../services/mechanic.service';
import { ServiceService } from '../../../services/service.service';
import { ModalService } from '../../../services/modal.service';
import { WorkOrder } from '../../../models/work-order.model';
import { Client } from '../../../models/client.model';
import { Vehicle } from '../../../models/vehicle.model';
import { Mechanic } from '../../../models/mechanic.model';
import { Service } from '../../../models/service.model';
import { TagSeverity } from '../../../models/ui.model';

@Component({
  selector: 'app-work-order-getall',
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
  templateUrl: './work-order-getall.component.html',
  encapsulation: ViewEncapsulation.None
})
export class WorkOrderGetallComponent implements OnInit {

  workOrders: WorkOrder[] = [];
  filteredWorkOrders: WorkOrder[] = [];
  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  mechanics: Mechanic[] = [];
  services: Service[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  priorityFilter: string = 'all';
  loading: boolean = false;

  statusOptions = [
    { label: 'Todas', value: 'all' },
    { label: 'Pendiente', value: 'pending' },
    { label: 'En Progreso', value: 'in-progress' },
    { label: 'Completada', value: 'completed' },
    { label: 'Cancelada', value: 'cancelled' }
  ];

  priorityOptions = [
    { label: 'Todas', value: 'all' },
    { label: 'Baja', value: 'low' },
    { label: 'Media', value: 'medium' },
    { label: 'Alta', value: 'high' },
    { label: 'Urgente', value: 'urgent' }
  ];

  constructor(
    private workOrderService: WorkOrderService,
    private clientService: ClientService,
    private vehicleService: VehicleService,
    private mechanicService: MechanicService,
    private serviceService: ServiceService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private modalService: ModalService
  ) {}


  /**
   * Devuelve el objeto de estilos para la barra de progreso de horas.
   */
  getProgressBarStyle(workOrder: any): { [key: string]: string } {
    return {
      width: this.getProgressPercentage(workOrder) + '%',
      height: '100%',
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      transition: 'width 0.3s ease'
    };
  }

  ngOnInit() {
    this.loadWorkOrders();
    this.loadClients();
    this.loadVehicles();
    this.loadMechanics();
    this.loadServices();
  }

  loadWorkOrders() {
    this.loading = true;
    this.workOrderService.getWorkOrders().subscribe({
      next: (workOrders) => {
        this.workOrders = workOrders;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando órdenes de trabajo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las órdenes de trabajo'
        });
        this.loading = false;
      }
    });
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
      }
    });
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
      },
      error: (error) => {
        console.error('Error cargando vehículos:', error);
      }
    });
  }

  loadMechanics() {
    this.mechanicService.getMechanics().subscribe({
      next: (mechanics) => {
        this.mechanics = mechanics;
      },
      error: (error) => {
        console.error('Error cargando mecánicos:', error);
      }
    });
  }

  loadServices() {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
      }
    });
  }

  applyFilters() {
    this.filteredWorkOrders = this.workOrders.filter(workOrder => {
      const matchesSearch = !this.searchTerm || 
        workOrder.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getClientName(workOrder.clientId).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (workOrder.notes && workOrder.notes.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = this.statusFilter === 'all' || 
        workOrder.status === this.statusFilter;
      
      const matchesPriority = this.priorityFilter === 'all' || 
        workOrder.priority === this.priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onPriorityFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.priorityFilter = 'all';
    this.applyFilters();
  }

  editWorkOrder(id: number) {
    this.router.navigate(['/work-orders/update', id]);
  }

  deleteWorkOrder(id: number) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar esta orden de trabajo?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.workOrderService.deleteWorkOrder(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Orden de trabajo eliminada correctamente'
            });
            this.loadWorkOrders();
          },
          error: (error) => {
            console.error('Error eliminando orden de trabajo:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la orden de trabajo'
            });
          }
        });
      }
    });
  }

  createWorkOrder() {
    this.router.navigate(['/work-orders/create']);
  }

  viewWorkOrder(workOrder: WorkOrder) {
    const config = ModalService.formatWorkOrderData
      ? ModalService.formatWorkOrderData(workOrder)
      : { title: 'Detalle de Orden', sections: [] };
    config.headerColor = 'rgba(245, 158, 11, 0.2)';
    config.title = 'Ver Detalle de la Orden';
    this.modalService.openViewModal(config);
  }

  confirmDeleteWorkOrder(workOrder: WorkOrder) {
    this.modalService.openDeleteModal(
      {
        title: '¿Eliminar Orden de Trabajo?',
        message: 'Esta acción no se puede deshacer. La orden será eliminada permanentemente.',
        itemName: `#${workOrder.id} - ${this.getClientName(workOrder.clientId)}`,
        itemLabel: 'Orden a eliminar:',
        showWarning: true,
        warningMessage: '⚠️ Se perderá toda la información relacionada con esta orden.'
      },
      () => this.executeDeleteWorkOrder(workOrder.id)
    );
  }

  private executeDeleteWorkOrder(id: number) {
    this.workOrderService.deleteWorkOrder(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Orden de trabajo eliminada correctamente'
        });
        this.loadWorkOrders();
      },
      error: (error) => {
        console.error('Error eliminando orden de trabajo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la orden de trabajo'
        });
      }
    });
  }

  getStatusSeverity(status: string): TagSeverity {
    switch (status) {
      case 'pending': return 'info';
      case 'in-progress': return 'warn';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in-progress': return 'En Progreso';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  }

  getPrioritySeverity(priority: string): TagSeverity {
    switch (priority) {
      case 'low': return 'info';
      case 'medium': return 'warn';
      case 'high': return 'danger';
      case 'urgent': return 'danger';
      default: return 'info';
    }
  }

  getPriorityText(priority: string): string {
    switch (priority) {
      case 'low': return 'Baja';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return priority;
    }
  }

  getClientName(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  }

  getVehicleInfo(vehicleId: number): string {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehículo no encontrado';
  }

  getMechanicName(mechanicId: number): string {
    const mechanic = this.mechanics.find(m => m.id === mechanicId);
    return mechanic ? `${mechanic.firstName} ${mechanic.lastName}` : 'Mecánico no encontrado';
  }

  getProgressPercentage(workOrder: WorkOrder): number {
    if (!workOrder.actualHours || workOrder.actualHours === 0) {
      return 0;
    }
    const percentage = (workOrder.actualHours / workOrder.estimatedHours) * 100;
    return Math.min(percentage, 100);
  }

  getServiceName(serviceId: number): string {
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.name : 'Servicio no encontrado';
  }
}