import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PaymentService } from '../../../core/services/payment.service';
import { Payment } from '../../../shared/models/payment.model';

@Component({
  selector: 'app-payment-create',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePicker,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './payment-create.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PaymentCreateComponent {
  payment: Payment = {
    id: 0,
    workOrderId: 0,
    amount: 0,
    paymentMethod: '',
    paymentDate: new Date(),
    status: 'pending',
    transactionId: '',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  paymentMethodOptions = [
    { label: 'Efectivo', value: 'cash' },
    { label: 'Tarjeta de Crédito', value: 'credit_card' },
    { label: 'Tarjeta de Débito', value: 'debit_card' },
    { label: 'Transferencia Bancaria', value: 'bank_transfer' },
    { label: 'Cheque', value: 'check' }
  ];

  statusOptions = [
    { label: 'Pendiente', value: 'pending' },
    { label: 'Completado', value: 'completed' },
    { label: 'Fallido', value: 'failed' },
    { label: 'Reembolsado', value: 'refunded' }
  ];

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
    if (this.isFormValid()) {
      this.paymentService.createPayment(this.payment).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Pago creado correctamente'
          });
          this.router.navigate(['/payments']);
        },
        error: (error: any) => {
          console.error('Error al crear el pago:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el pago'
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
    this.payment = {
      id: 0,
      workOrderId: 0,
      amount: 0,
      paymentMethod: '',
      paymentDate: new Date(),
      status: 'pending',
      transactionId: '',
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private isFormValid(): boolean {
    return !!(
      this.payment.workOrderId > 0 &&
      this.payment.amount > 0 &&
      this.payment.paymentMethod?.trim() &&
      this.payment.paymentDate &&
      this.payment.status?.trim()
    );
  }
}