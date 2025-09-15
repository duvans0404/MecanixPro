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
import { AppointmentService } from '../../../services/appointment.service';
import { ClientService } from '../../../services/client.service';
import { VehicleService } from '../../../services/vehicle.service';
import { MechanicService } from '../../../services/mechanic.service';
import { ServiceService } from '../../../services/service.service';
import { Appointment } from '../../../models/appointment.model';
import { Client } from '../../../models/client.model';
import { Vehicle } from '../../../models/vehicle.model';
import { Mechanic } from '../../../models/mechanic.model';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-appointment-getall',
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
  providers: [ConfirmationService, MessageService],
  templateUrl: './appointment-getall.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppointmentGetallComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  mechanics: Mechanic[] = [];
  services: Service[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  dateFilter: Date | null = null;
  loading: boolean = false;

  statusOptions = [
    { label: 'Todas', value: 'all' },
    { label: 'Programada', value: 'scheduled' },
    { label: 'En Progreso', value: 'in-progress' },
    { label: 'Completada', value: 'completed' },
    { label: 'Cancelada', value: 'cancelled' }
  ];

  constructor(
    private appointmentService: AppointmentService,
    private clientService: ClientService,
    private vehicleService: VehicleService,
    private mechanicService: MechanicService,
    private serviceService: ServiceService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadClients();
    this.loadVehicles();
    this.loadMechanics();
    this.loadServices();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando citas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las citas'
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
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesSearch = !this.searchTerm || 
        this.getClientName(appointment.clientId.toString()).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getVehicleInfo(appointment.vehicleId.toString()).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (appointment.notes && appointment.notes.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = this.statusFilter === 'all' || 
        appointment.status === this.statusFilter;
      
      const matchesDate = !this.dateFilter || 
        new Date(appointment.appointmentDate).toDateString() === this.dateFilter.toDateString();
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onDateFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.dateFilter = null;
    this.applyFilters();
  }

  editAppointment(id: number) {
    this.router.navigate(['/appointments/update', id]);
  }

  deleteAppointment(id: number) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar esta cita?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.appointmentService.deleteAppointment(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cita eliminada correctamente'
            });
            this.loadAppointments();
          },
          error: (error) => {
            console.error('Error eliminando cita:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la cita'
            });
          }
        });
      }
    });
  }

  createAppointment() {
    this.router.navigate(['/appointments/create']);
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'scheduled': return 'info';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'scheduled': return 'Programada';
      case 'in-progress': return 'En Progreso';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  }

  getClientName(clientId: string): string {
    const client = this.clients.find(c => c.id.toString() === clientId);
    return client ? client.name : 'Cliente no encontrado';
  }

  getVehicleInfo(vehicleId: string): string {
    const vehicle = this.vehicles.find(v => v.id.toString() === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehículo no encontrado';
  }

  getMechanicName(mechanicId: string): string {
    const mechanic = this.mechanics.find(m => m.id.toString() === mechanicId);
    return mechanic ? `${mechanic.firstName} ${mechanic.lastName}` : 'Mecánico no encontrado';
  }

  getServiceName(serviceId: string): string {
    const service = this.services.find(s => s.id.toString() === serviceId);
    return service ? service.name : 'Servicio no encontrado';
  }
}