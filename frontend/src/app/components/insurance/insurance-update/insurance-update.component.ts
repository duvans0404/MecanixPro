import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-insurance-update',
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
  templateUrl: './insurance-update.component.html',
  encapsulation: ViewEncapsulation.None
})
export class InsuranceUpdateComponent implements OnInit {
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

  loading = false;
  error: string | null = null;
  insuranceId: number = 0;

  coverageOptions = [
    { label: 'Completa', value: 'full' },
    { label: 'Responsabilidad Civil', value: 'liability' },
    { label: 'Colisión', value: 'collision' },
    { label: 'Comprensiva', value: 'comprehensive' }
  ];

  constructor(
    private insuranceService: InsuranceService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.insuranceId = +params['id'];
      if (this.insuranceId) {
        this.loadInsurance();
      }
    });
  }

  loadInsurance() {
    this.loading = true;
    this.error = null;
    
    this.insuranceService.getInsuranceById(this.insuranceId).subscribe({
      next: (insurance: Insurance | undefined) => {
        if (insurance) {
          this.insurance = insurance;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar el seguro';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el seguro'
        });
        console.error('Error:', error);
      }
    });
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.loading = true;
      this.error = null;
      
      this.insuranceService.updateInsurance(this.insuranceId, this.insurance).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Seguro actualizado correctamente'
          });
          this.router.navigate(['/insurance']);
        },
        error: (error: any) => {
          this.error = 'Error al actualizar el seguro';
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el seguro'
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
    this.router.navigate(['/insurance']);
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