import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
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
  selector: 'app-appointment-create',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ButtonModule,
    SelectModule,
    DatePicker,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './appointment-create.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppointmentCreateComponent implements OnInit {
  appointment: Appointment = {
    id: 0,
    clientId: 0,
    vehicleId: 0,
    mechanicId: 0,
    serviceId: 0,
    appointmentDate: new Date(),
    status: 'scheduled',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  mechanics: Mechanic[] = [];
  services: Service[] = [];

  clientOptions: { label: string, value: number }[] = [];
  vehicleOptions: { label: string, value: number }[] = [];
  mechanicOptions: { label: string, value: number }[] = [];
  serviceOptions: { label: string, value: number }[] = [];

  statusOptions = [
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
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadClients();
    this.loadVehicles();
    this.loadMechanics();
    this.loadServices();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.clientOptions = clients.map(client => ({
          label: client.name,
          value: client.id
        }));
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los clientes'
        });
      }
    });
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.updateVehicleOptions();
      },
      error: (error) => {
        console.error('Error cargando vehículos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los vehículos'
        });
      }
    });
  }

  updateVehicleOptions() {
    if (this.appointment.clientId > 0) {
      const filteredVehicles = this.vehicles.filter(vehicle => vehicle.clientId === this.appointment.clientId);
      this.vehicleOptions = filteredVehicles.map(vehicle => ({
        label: `${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`,
        value: vehicle.id
      }));
    } else {
      this.vehicleOptions = this.vehicles.map(vehicle => {
        const client = this.clients.find(c => c.id === vehicle.clientId);
        const clientName = client ? ` (${client.name})` : '';
        return {
          label: `${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}${clientName}`,
          value: vehicle.id
        };
      });
    }
  }

  onClientChange() {
    this.appointment.vehicleId = 0;
    this.updateVehicleOptions();
  }

  loadMechanics() {
    this.mechanicService.getMechanics().subscribe({
      next: (mechanics) => {
        this.mechanics = mechanics;
        this.mechanicOptions = mechanics.map(mechanic => ({
          label: `${mechanic.firstName} ${mechanic.lastName}`,
          value: mechanic.id
        }));
      },
      error: (error) => {
        console.error('Error cargando mecánicos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los mecánicos'
        });
      }
    });
  }

  loadServices() {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.serviceOptions = services.map(service => ({
          label: service.name,
          value: service.id
        }));
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los servicios'
        });
      }
    });
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.appointmentService.createAppointment(this.appointment).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cita creada correctamente'
          });
          this.router.navigate(['/appointments']);
        },
        error: (error) => {
          console.error('Error al crear la cita:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la cita'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor, completa todos los campos requeridos correctamente'
      });
    }
  }

  resetForm() {
    this.appointment = {
      id: 0,
      clientId: 0,
      vehicleId: 0,
      mechanicId: 0,
      serviceId: 0,
      appointmentDate: new Date(),
      status: 'scheduled',
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private isFormValid(): boolean {
    return !!(
      this.appointment.clientId > 0 &&
      this.appointment.vehicleId > 0 &&
      this.appointment.mechanicId > 0 &&
      this.appointment.serviceId > 0 &&
      this.appointment.appointmentDate &&
      this.appointment.status?.trim()
    );
  }
}