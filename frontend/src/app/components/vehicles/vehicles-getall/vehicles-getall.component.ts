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
import { VehicleService } from '../../../services/vehicle.service';
import { ClientService } from '../../../services/client.service';
import { Vehicle } from '../../../models/vehicle.model';
import { Client } from '../../../models/client.model';
import { TagSeverity } from '../../../models/ui.model';

@Component({
  selector: 'app-vehicles-getall',
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
  
  templateUrl: './vehicles-getall.component.html',
  encapsulation: ViewEncapsulation.None
})
export class VehiclesGetallComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  clients: Client[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  clientFilter: string = 'all';
  yearFilter: number | null = null;
  makeFilter: string | null = null;
  loading: boolean = false;

  statusOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' }
  ];

  clientOptions: { label: string, value: string }[] = [
    { label: 'Todos los clientes', value: 'all' }
  ];

  constructor(
    private vehicleService: VehicleService,
    private clientService: ClientService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadVehicles();
    this.loadClients();
  }

  loadVehicles() {
    this.loading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando vehículos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los vehículos'
        });
        this.loading = false;
      }
    });
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.clientOptions = [
          { label: 'Todos los clientes', value: 'all' },
          ...clients.map(client => ({
            label: client.name,
            value: client.id.toString()
          }))
        ];
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
      }
    });
  }

  applyFilters() {
    this.filteredVehicles = this.vehicles.filter(vehicle => {
      const matchesSearch = !this.searchTerm || 
        vehicle.make.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.year.toString().includes(this.searchTerm) ||
        vehicle.licensePlate.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || 
        (this.statusFilter === 'active' && vehicle.active) ||
        (this.statusFilter === 'inactive' && !vehicle.active);
      
      const matchesClient = this.clientFilter === 'all' || 
        vehicle.clientId.toString() === this.clientFilter;
      
      return matchesSearch && matchesStatus && matchesClient;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onClientFilterChange() {
    this.applyFilters();
  }

  editVehicle(vehicle: Vehicle) {
    this.router.navigate(['/vehicles/update', vehicle.id]);
  }

  deleteVehicle(vehicle: Vehicle) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar el vehículo ${vehicle.make} ${vehicle.model}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
          this.vehicleService.deleteVehicle(vehicle.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Vehículo eliminado correctamente'
            });
            this.loadVehicles();
          },
          error: (error) => {
            console.error('Error eliminando vehículo:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el vehículo'
            });
          }
        });
      }
    });
  }

  createVehicle() {
    this.router.navigate(['/vehicles/create']);
  }

  getStatusSeverity(active: boolean): TagSeverity {
    return active ? 'success' : 'danger';
  }

  getStatusLabel(active: boolean): string {
    return active ? 'Activo' : 'Inactivo';
  }

  getClientName(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  }

  clearFilters() {
    this.searchTerm = '';
    this.yearFilter = null;
    this.makeFilter = null;
    this.statusFilter = 'all';
    this.clientFilter = 'all';
    this.loadVehicles();
  }
}
