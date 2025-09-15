import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InsuranceService } from '../../../services/insurance.service';
import { Insurance } from '../../../models/insurance.model';

@Component({
  selector: 'app-insurance-create',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePicker,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './insurance-create.component.html',
  encapsulation: ViewEncapsulation.None
})
export class InsuranceCreateComponent {
  insurance: Insurance = {
    id: 0,
    vehicleId: 0,
    companyName: '',
    policyNumber: '',
    coverageType: '',
    startDate: new Date(),
    endDate: new Date(),
    premium: 0,
    deductible: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  coverageOptions = [
    { label: 'Completa', value: 'full' },
    { label: 'Responsabilidad Civil', value: 'liability' },
    { label: 'Colisión', value: 'collision' },
    { label: 'Comprensiva', value: 'comprehensive' }
  ];

  constructor(
    private insuranceService: InsuranceService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
    if (this.isFormValid()) {
      this.insuranceService.createInsurance(this.insurance).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Seguro creado correctamente'
          });
          this.router.navigate(['/insurance']);
        },
        error: (error) => {
          console.error('Error al crear el seguro:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el seguro'
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
    this.insurance = {
      id: 0,
      vehicleId: 0,
      companyName: '',
      policyNumber: '',
      coverageType: '',
      startDate: new Date(),
      endDate: new Date(),
      premium: 0,
      deductible: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private isFormValid(): boolean {
    return !!(
      this.insurance.vehicleId > 0 &&
      this.insurance.companyName?.trim() &&
      this.insurance.policyNumber?.trim() &&
      this.insurance.coverageType?.trim() &&
      this.insurance.startDate &&
      this.insurance.endDate &&
      this.insurance.premium > 0 &&
      this.insurance.deductible >= 0
    );
  }
}