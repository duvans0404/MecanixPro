import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { WorkOrderService } from '../../../services/work-order.service';
import { ClientService } from '../../../services/client.service';
import { VehicleService } from '../../../services/vehicle.service';
import { MechanicService } from '../../../services/mechanic.service';
import { ServiceService } from '../../../services/service.service';
import { WorkOrder } from '../../../models/work-order.model';
import { Client } from '../../../models/client.model';
import { Vehicle } from '../../../models/vehicle.model';
import { Mechanic } from '../../../models/mechanic.model';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-work-order-create',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ButtonModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './work-order-create.component.html',
  encapsulation: ViewEncapsulation.None
})
export class WorkOrderCreateComponent implements OnInit {
  workOrder: WorkOrder = {
    id: 0,
    clientId: 0,
    vehicleId: 0,
    mechanicId: 0,
    serviceId: 0,
    description: '',
    status: 'pending',
    priority: 'medium',
    estimatedHours: 0,
    actualHours: 0,
    laborCost: 0,
    partsCost: 0,
    totalCost: 0,
    startDate: new Date(),
    endDate: new Date(),
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
    { label: 'Pendiente', value: 'pending' },
    { label: 'En Progreso', value: 'in-progress' },
    { label: 'Completada', value: 'completed' },
    { label: 'Cancelada', value: 'cancelled' }
  ];

  priorityOptions = [
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
    // Si hay un cliente seleccionado, filtrar vehículos por cliente
    if (this.workOrder.clientId > 0) {
      const filteredVehicles = this.vehicles.filter(vehicle => vehicle.clientId === this.workOrder.clientId);
      this.vehicleOptions = filteredVehicles.map(vehicle => ({
        label: `${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`,
        value: vehicle.id
      }));
    } else {
      // Mostrar todos los vehículos con información del cliente
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
    // Reset vehicle selection when client changes
    this.workOrder.vehicleId = 0;
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
      this.workOrderService.createWorkOrder(this.workOrder).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Orden de trabajo creada correctamente'
          });
          this.router.navigate(['/work-orders']);
        },
        error: (error) => {
          console.error('Error al crear la orden de trabajo:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la orden de trabajo'
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
    this.workOrder = {
      id: 0,
      clientId: 0,
      vehicleId: 0,
      mechanicId: 0,
      serviceId: 0,
      description: '',
      status: 'pending',
      priority: 'medium',
      estimatedHours: 0,
      actualHours: 0,
      laborCost: 0,
      partsCost: 0,
      totalCost: 0,
      startDate: new Date(),
      endDate: new Date(),
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private isFormValid(): boolean {
    return !!(
      this.workOrder.clientId > 0 &&
      this.workOrder.vehicleId > 0 &&
      this.workOrder.mechanicId > 0 &&
      this.workOrder.serviceId > 0 &&
      this.workOrder.description?.trim() &&
      this.workOrder.status?.trim() &&
      this.workOrder.priority?.trim() &&
      this.workOrder.estimatedHours > 0 &&
      this.workOrder.laborCost >= 0 &&
      this.workOrder.partsCost >= 0 &&
      this.workOrder.totalCost >= 0 &&
      this.workOrder.startDate
    );
  }
}