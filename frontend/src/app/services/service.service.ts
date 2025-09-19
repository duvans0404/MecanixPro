
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceI } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = '/api/services';

  constructor(private http: HttpClient) { }

  getServices(): Observable<ServiceI[]> {
    return this.http.get<ServiceI[]>(this.apiUrl);
  }

  getServiceById(id: number): Observable<ServiceI> {
    return this.http.get<ServiceI>(`${this.apiUrl}/${id}`);
  }

  createService(service: Partial<ServiceI>): Observable<ServiceI> {
    return this.http.post<ServiceI>(this.apiUrl, service);
  }

  updateService(id: number, service: Partial<ServiceI>): Observable<ServiceI> {
    return this.http.put<ServiceI>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
