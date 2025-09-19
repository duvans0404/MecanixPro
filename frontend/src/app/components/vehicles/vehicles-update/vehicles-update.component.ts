import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VehicleService } from '../../../services/vehicle.service';
import { ClientService } from '../../../services/client.service';
import { Vehicle } from '../../../models/vehicle.model';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-vehicles-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './vehicles-update.component.html',
  encapsulation: ViewEncapsulation.None
})
export class VehiclesUpdateComponent implements OnInit {
  vehicleForm: FormGroup;
  vehicle: Vehicle | null = null;
  clients: Client[] = [];
  loading: boolean = false;
  vehicleId: string = '';

  clientOptions: { label: string, value: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.vehicleForm = this.fb.group({
      make: ['', [Validators.required, Validators.minLength(2)]],
      model: ['', [Validators.required, Validators.minLength(2)]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      licensePlate: ['', [Validators.required, Validators.pattern(/^[A-Z0-9\-\s]+$/i)]],
      vin: ['', [Validators.required, Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/i)]],
      color: ['', [Validators.required]],
      clientId: ['', [Validators.required]],
      active: [true]
    });
  }

  ngOnInit() {
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';
    if (this.vehicleId) {
      this.loadVehicle();
      this.loadClients();
    }
  }

  loadVehicle() {
  this.loading = true;
  this.vehicleService.getVehicleById(Number(this.vehicleId)).subscribe({
      next: (vehicle) => {
        if (vehicle) {
          this.vehicle = vehicle;
          this.vehicleForm.patchValue({
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            licensePlate: vehicle.licensePlate,
            vin: vehicle.vin,
            color: vehicle.color,
            clientId: vehicle.clientId.toString(),
            active: vehicle.active
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando vehículo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el vehículo'
        });
        this.loading = false;
        this.router.navigate(['/vehicles']);
      }
    });
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.clientOptions = clients.map(client => ({
          label: client.name,
          value: client.id.toString()
        }));
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
      }
    });
  }

  onSubmit() {
    if (this.vehicleForm.valid && this.vehicle) {
      this.loading = true;
      const vehicleData = this.vehicleForm.value;
      
  this.vehicleService.updateVehicle(Number(this.vehicleId), vehicleData).subscribe({
        next: (vehicle) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Vehículo actualizado correctamente'
          });
          this.loading = false;
          this.router.navigate(['/vehicles']);
        },
        error: (error) => {
          console.error('Error actualizando vehículo:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el vehículo'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor, completa todos los campos requeridos correctamente'
      });
    }
  }

  onCancel() {
    this.router.navigate(['/vehicles']);
  }

  markFormGroupTouched() {
    Object.keys(this.vehicleForm.controls).forEach(key => {
      const control = this.vehicleForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.vehicleForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${this.getFieldLabel(fieldName)} debe ser menor a ${field.errors['max'].max}`;
      }
      if (field.errors['pattern']) {
        if (fieldName === 'vin') {
          return 'VIN debe tener exactamente 17 caracteres alfanuméricos';
        }
        if (fieldName === 'licensePlate') {
          return 'Placa debe contener solo letras, números, guiones y espacios';
        }
        return `${this.getFieldLabel(fieldName)} tiene un formato inválido`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      make: 'Marca',
      model: 'Modelo',
      year: 'Año',
      licensePlate: 'Placa',
      vin: 'VIN',
      color: 'Color',
      clientId: 'Cliente'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.vehicleForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
