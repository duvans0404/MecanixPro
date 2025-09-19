
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentI } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = '/api/payments';

  constructor(private http: HttpClient) { }

  getPayments(): Observable<PaymentI[]> {
    return this.http.get<PaymentI[]>(this.apiUrl);
  }

  getPaymentById(id: number): Observable<PaymentI> {
    return this.http.get<PaymentI>(`${this.apiUrl}/${id}`);
  }

  createPayment(payment: Partial<PaymentI>): Observable<PaymentI> {
    return this.http.post<PaymentI>(this.apiUrl, payment);
  }

  updatePayment(id: number, payment: Partial<PaymentI>): Observable<PaymentI> {
    return this.http.put<PaymentI>(`${this.apiUrl}/${id}`, payment);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
