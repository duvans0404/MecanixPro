import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-clients-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './clients-update.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ClientsUpdateComponent implements OnInit {
  clientForm: FormGroup;
  client: Client | null = null;
  loading: boolean = false;
  clientId: string = '';

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.minLength(6)]],
      active: [true]
    });
  }

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('id') || '';
    if (this.clientId) {
      this.loadClient();
    }
  }

  loadClient() {
    this.loading = true;
    this.clientService.getClient(this.clientId).subscribe({
      next: (client) => {
        if (client) {
          this.client = client;
          this.clientForm.patchValue({
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            active: client.active
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando cliente:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el cliente'
        });
        this.loading = false;
        this.router.navigate(['/clients']);
      }
    });
  }

  onSubmit() {
    if (this.clientForm.valid && this.client) {
      this.loading = true;
      const clientData = this.clientForm.value;
      
      // Si no se proporciona contraseña, no la incluimos en la actualización
      if (!clientData.password) {
        delete clientData.password;
      }
      
      this.clientService.updateClient(this.clientId, clientData).subscribe({
        next: (client) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente actualizado correctamente'
          });
          this.loading = false;
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          console.error('Error actualizando cliente:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el cliente'
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
    this.router.navigate(['/clients']);
  }

  markFormGroupTouched() {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return `${this.getFieldLabel(fieldName)} tiene un formato inválido`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombre',
      email: 'Email',
      phone: 'Teléfono',
      address: 'Dirección',
      password: 'Contraseña'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
