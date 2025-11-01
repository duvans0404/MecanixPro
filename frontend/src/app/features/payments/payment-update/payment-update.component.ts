import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PaymentService } from '../../../core/services/payment.service';
import { Payment } from '../../../shared/models/payment.model';

@Component({
  selector: 'app-payment-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './payment-update.component.html',
})
export class PaymentUpdateComponent implements OnInit {
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

  loading = false;
  error: string | null = null;
  paymentId: number = 0;

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.paymentId = +params['id'];
      if (this.paymentId) {
        this.loadPayment();
      }
    });
  }

  loadPayment() {
    this.loading = true;
    this.error = null;
    
    this.paymentService.getPaymentById(this.paymentId).subscribe({
      next: (payment: Payment | undefined) => {
        if (payment) {
          this.payment = payment;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar el pago';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el pago'
        });
        console.error('Error:', error);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    
    this.paymentService.updatePayment(this.paymentId, this.payment).subscribe({
      next: (response: any) => {
        console.log('Pago actualizado exitosamente:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Pago actualizado correctamente'
        });
        this.router.navigate(['/payments']);
      },
      error: (error: any) => {
        this.error = 'Error al actualizar el pago';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar el pago'
        });
        console.error('Error:', error);
      }
    });
  }

  cancel() {
    this.router.navigate(['/payments']);
  }
}
