import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MechanicService } from '../../../services/mechanic.service';
import { Mechanic } from '../../../models/mechanic.model';

@Component({
  selector: 'app-mechanic-create',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './mechanic-create.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MechanicCreateComponent {
  mechanic: Mechanic = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    experienceYears: 0,
    hourlyRate: 0,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  specializationOptions = [
    { label: 'Motor', value: 'engine' },
    { label: 'Transmisión', value: 'transmission' },
    { label: 'Frenos', value: 'brakes' },
    { label: 'Eléctrico', value: 'electrical' },
    { label: 'Aire Acondicionado', value: 'air-conditioning' },
    { label: 'General', value: 'general' }
  ];

  constructor(
    private mechanicService: MechanicService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
    if (this.isFormValid()) {
      this.mechanicService.createMechanic(this.mechanic).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Mecánico creado correctamente'
          });
          this.router.navigate(['/mechanics']);
        },
        error: (error) => {
          console.error('Error al crear el mecánico:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el mecánico'
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
    this.mechanic = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialization: '',
      experienceYears: 0,
      hourlyRate: 0,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private isFormValid(): boolean {
    return !!(
      this.mechanic.firstName?.trim() &&
      this.mechanic.lastName?.trim() &&
      this.mechanic.email?.trim() &&
      this.mechanic.phone?.trim() &&
      this.mechanic.specialization?.trim() &&
      this.mechanic.experienceYears >= 0 &&
      this.mechanic.hourlyRate >= 0
    );
  }
}