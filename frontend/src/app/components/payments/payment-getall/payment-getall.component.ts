import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment.model';

@Component({
  selector: 'app-payment-getall',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './payment-getall.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PaymentGetallComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  methodFilter: string = 'all';
  loading: boolean = false;

  statusOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Pendiente', value: 'pending' },
    { label: 'Completado', value: 'completed' },
    { label: 'Fallido', value: 'failed' },
    { label: 'Reembolsado', value: 'refunded' }
  ];

  methodOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Efectivo', value: 'cash' },
    { label: 'Tarjeta de Crédito', value: 'credit_card' },
    { label: 'Tarjeta de Débito', value: 'debit_card' },
    { label: 'Transferencia Bancaria', value: 'bank_transfer' },
    { label: 'Cheque', value: 'check' }
  ];

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.loading = true;
    this.paymentService.getPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando pagos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los pagos'
        });
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredPayments = this.payments.filter(payment => {
      const matchesSearch = !this.searchTerm || 
        payment.id.toString().includes(this.searchTerm) ||
        payment.workOrderId.toString().includes(this.searchTerm) ||
        this.getPaymentMethodText(payment.paymentMethod).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (payment.transactionId && payment.transactionId.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = this.statusFilter === 'all' || 
        payment.status === this.statusFilter;
      
      const matchesMethod = this.methodFilter === 'all' || 
        payment.paymentMethod === this.methodFilter;
      
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onMethodFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.methodFilter = 'all';
    this.applyFilters();
  }

  editPayment(id: number) {
    this.router.navigate(['/payments/update', id]);
  }

  deletePayment(id: number) {
    const payment = this.payments.find(p => p.id === id);
    const paymentName = payment ? `Pago #${payment.id}` : 'este pago';
    
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar ${paymentName}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.paymentService.deletePayment(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Pago eliminado correctamente'
            });
            this.loadPayments();
          },
          error: (error) => {
            console.error('Error eliminando pago:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el pago'
            });
          }
        });
      }
    });
  }

  createPayment() {
    this.router.navigate(['/payments/create']);
  }

  getPaymentMethodText(method: string): string {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'credit_card': return 'Tarjeta de Crédito';
      case 'debit_card': return 'Tarjeta de Débito';
      case 'bank_transfer': return 'Transferencia Bancaria';
      case 'check': return 'Cheque';
      default: return method;
    }
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'pending': return 'warn';
      case 'completed': return 'success';
      case 'failed': return 'danger';
      case 'refunded': return 'info';
      default: return 'secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'completed': return 'Completado';
      case 'failed': return 'Fallido';
      case 'refunded': return 'Reembolsado';
      default: return status;
    }
  }
}