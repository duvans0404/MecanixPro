import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-services-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    SelectModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './services-update.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ServicesUpdateComponent implements OnInit {
  serviceForm: FormGroup;
  service: Service | null = null;
  loading: boolean = false;
  serviceId: string = '';

  categoryOptions = [
    { label: 'Mantenimiento', value: 'Mantenimiento' },
    { label: 'Reparación', value: 'Reparación' },
    { label: 'Diagnóstico', value: 'Diagnóstico' },
    { label: 'Limpieza', value: 'Limpieza' },
    { label: 'Inspección', value: 'Inspección' },
    { label: 'Otros', value: 'Otros' }
  ];

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      durationMinutes: ['', [Validators.required, Validators.min(1)]],
      active: [true]
    });
  }

  ngOnInit() {
    this.serviceId = this.route.snapshot.paramMap.get('id') || '';
    if (this.serviceId) {
      this.loadService();
    }
  }

  loadService() {
    this.loading = true;
    this.serviceService.getService(this.serviceId).subscribe({
      next: (service) => {
        if (service) {
          this.service = service;
          this.serviceForm.patchValue({
            name: service.name,
            description: service.description,
            category: service.category,
            price: service.price,
            durationMinutes: service.durationMinutes,
            active: service.active
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando servicio:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el servicio'
        });
        this.loading = false;
        this.router.navigate(['/services']);
      }
    });
  }

  onSubmit() {
    if (this.serviceForm.valid && this.service) {
      this.loading = true;
      const serviceData = this.serviceForm.value;
      
      this.serviceService.updateService(this.serviceId, serviceData).subscribe({
        next: (service) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Servicio actualizado correctamente'
          });
          this.loading = false;
          this.router.navigate(['/services']);
        },
        error: (error) => {
          console.error('Error actualizando servicio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el servicio'
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
    this.router.navigate(['/services']);
  }

  markFormGroupTouched() {
    Object.keys(this.serviceForm.controls).forEach(key => {
      const control = this.serviceForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.serviceForm.get(fieldName);
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
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombre',
      description: 'Descripción',
      category: 'Categoría',
      price: 'Precio',
      durationMinutes: 'Duración'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
