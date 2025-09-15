import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppointmentI } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  
  private appointments: AppointmentI[] = [
    {
      id: 1,
      clientId: 1,
      vehicleId: 1,
      mechanicId: 1,
      serviceId: 1,
      appointmentDate: new Date('2024-08-20T09:00:00'),
      status: 'scheduled',
      notes: 'Revisión general del vehículo',
      createdAt: new Date('2024-08-15'),
      updatedAt: new Date('2024-08-15')
    },
    {
      id: 2,
      clientId: 2,
      vehicleId: 2,
      mechanicId: 2,
      serviceId: 2,
      appointmentDate: new Date('2024-08-22T14:30:00'),
      status: 'scheduled',
      notes: 'Cambio de aceite programado',
      createdAt: new Date('2024-08-16'),
      updatedAt: new Date('2024-08-16')
    },
    {
      id: 3,
      clientId: 3,
      vehicleId: 3,
      mechanicId: 3,
      serviceId: 3,
      appointmentDate: new Date('2024-08-18T10:15:00'),
      status: 'completed',
      notes: 'Reparación de frenos',
      createdAt: new Date('2024-08-10'),
      updatedAt: new Date('2024-08-18')
    }
  ];

  constructor() { }

  getAppointments(): Observable<AppointmentI[]> {
    return of(this.appointments);
  }

  getAppointmentById(id: number): Observable<AppointmentI | undefined> {
    const appointment = this.appointments.find(a => a.id === id);
    return of(appointment);
  }

  getAppointmentsByClientId(clientId: number): Observable<AppointmentI[]> {
    const appointments = this.appointments.filter(a => a.clientId === clientId);
    return of(appointments);
  }

  getAppointmentsByVehicleId(vehicleId: number): Observable<AppointmentI[]> {
    const appointments = this.appointments.filter(a => a.vehicleId === vehicleId);
    return of(appointments);
  }

  createAppointment(appointment: AppointmentI): Observable<AppointmentI> {
    const newAppointment: AppointmentI = {
      ...appointment,
      id: this.appointments.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.appointments.push(newAppointment);
    return of(newAppointment);
  }

  updateAppointment(id: number, appointment: AppointmentI): Observable<AppointmentI> {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments[index] = {
        ...appointment,
        id,
        updatedAt: new Date()
      };
      return of(this.appointments[index]);
    }
    throw new Error('Appointment not found');
  }

  deleteAppointment(id: number): Observable<void> {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Appointment not found');
  }

  updateStatus(id: number, status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'): Observable<AppointmentI> {
    const appointment = this.appointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = status;
      appointment.updatedAt = new Date();
      return of(appointment);
    }
    throw new Error('Appointment not found');
  }
}
