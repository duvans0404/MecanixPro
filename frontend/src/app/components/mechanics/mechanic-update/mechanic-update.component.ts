import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MechanicService } from '../../../services/mechanic.service';
import { Mechanic } from '../../../models/mechanic.model';

@Component({
  selector: 'app-mechanic-update',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './mechanic-update.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MechanicUpdateComponent implements OnInit {
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

  loading = false;
  error: string | null = null;
  mechanicId: number = 0;

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
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mechanicId = +params['id'];
      if (this.mechanicId) {
        this.loadMechanic();
      }
    });
  }

  loadMechanic() {
    this.loading = true;
    this.error = null;
    
    this.mechanicService.getMechanicById(this.mechanicId).subscribe({
      next: (mechanic: Mechanic | undefined) => {
        if (mechanic) {
          this.mechanic = mechanic;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar el mecánico';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el mecánico'
        });
        console.error('Error:', error);
      }
    });
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.loading = true;
      this.error = null;
      
      this.mechanicService.updateMechanic(this.mechanicId, this.mechanic).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Mecánico actualizado correctamente'
          });
          this.router.navigate(['/mechanics']);
        },
        error: (error: any) => {
          this.error = 'Error al actualizar el mecánico';
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el mecánico'
          });
          console.error('Error:', error);
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

  cancel() {
    this.router.navigate(['/mechanics']);
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