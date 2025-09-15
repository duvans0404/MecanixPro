import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaymentI } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  
  private payments: PaymentI[] = [
    {
      id: 1,
      workOrderId: 1,
      amount: 150000,
      paymentMethod: 'credit_card',
      paymentDate: new Date('2024-08-15'),
      status: 'completed',
      transactionId: 'TXN-001-2024',
      notes: 'Pago con tarjeta de crédito',
      createdAt: new Date('2024-08-15'),
      updatedAt: new Date('2024-08-15')
    },
    {
      id: 2,
      workOrderId: 2,
      amount: 200000,
      paymentMethod: 'cash',
      paymentDate: new Date('2024-08-16'),
      status: 'completed',
      transactionId: '',
      notes: 'Pago en efectivo',
      createdAt: new Date('2024-08-16'),
      updatedAt: new Date('2024-08-16')
    },
    {
      id: 3,
      workOrderId: 3,
      amount: 75000,
      paymentMethod: 'bank_transfer',
      paymentDate: new Date('2024-08-17'),
      status: 'pending',
      transactionId: 'TXN-003-2024',
      notes: 'Transferencia bancaria pendiente',
      createdAt: new Date('2024-08-17'),
      updatedAt: new Date('2024-08-17')
    }
  ];

  constructor() { }

  getPayments(): Observable<PaymentI[]> {
    return of(this.payments);
  }

  getPaymentById(id: number): Observable<PaymentI | undefined> {
    const payment = this.payments.find(p => p.id === id);
    return of(payment);
  }

  getPaymentsByWorkOrderId(workOrderId: number): Observable<PaymentI[]> {
    const payments = this.payments.filter(p => p.workOrderId === workOrderId);
    return of(payments);
  }

  createPayment(payment: PaymentI): Observable<PaymentI> {
    const newPayment: PaymentI = {
      ...payment,
      id: this.payments.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.payments.push(newPayment);
    return of(newPayment);
  }

  updatePayment(id: number, payment: PaymentI): Observable<PaymentI> {
    const index = this.payments.findIndex(p => p.id === id);
    if (index !== -1) {
      this.payments[index] = {
        ...payment,
        id,
        updatedAt: new Date()
      };
      return of(this.payments[index]);
    }
    throw new Error('Payment not found');
  }

  deletePayment(id: number): Observable<void> {
    const index = this.payments.findIndex(p => p.id === id);
    if (index !== -1) {
      this.payments.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Payment not found');
  }

  updateStatus(id: number, status: 'pending' | 'completed' | 'failed' | 'refunded'): Observable<PaymentI> {
    const payment = this.payments.find(p => p.id === id);
    if (payment) {
      payment.status = status;
      payment.updatedAt = new Date();
      return of(payment);
    }
    throw new Error('Payment not found');
  }
}
