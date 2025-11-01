import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppointmentI } from '../../shared/models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = '/api/appointments';

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<AppointmentI[]> {
    return this.http.get<AppointmentI[]>(this.apiUrl);
  }

  getAppointmentById(id: number): Observable<AppointmentI> {
    return this.http.get<AppointmentI>(`${this.apiUrl}/${id}`);
  }

  createAppointment(appointment: Partial<AppointmentI>): Observable<AppointmentI> {
    return this.http.post<AppointmentI>(this.apiUrl, appointment);
  }

  updateAppointment(id: number, appointment: Partial<AppointmentI>): Observable<AppointmentI> {
    return this.http.put<AppointmentI>(`${this.apiUrl}/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
