
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkOrderI } from '../models/work-order.model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private apiUrl = '/api/work-orders';

  constructor(private http: HttpClient) { }

  getWorkOrders(): Observable<WorkOrderI[]> {
    return this.http.get<WorkOrderI[]>(this.apiUrl);
  }

  getWorkOrderById(id: number): Observable<WorkOrderI> {
    return this.http.get<WorkOrderI>(`${this.apiUrl}/${id}`);
  }

  createWorkOrder(workOrder: Partial<WorkOrderI>): Observable<WorkOrderI> {
    return this.http.post<WorkOrderI>(this.apiUrl, workOrder);
  }

  updateWorkOrder(id: number, workOrder: Partial<WorkOrderI>): Observable<WorkOrderI> {
    return this.http.put<WorkOrderI>(`${this.apiUrl}/${id}`, workOrder);
  }

  deleteWorkOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
