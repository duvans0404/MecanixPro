import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/appointment.model';

@Component({
  selector: 'app-appointment-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-update.component.html',
})
export class AppointmentUpdateComponent implements OnInit {
  appointment: Appointment = {
    id: 0,
    clientId: 0,
    vehicleId: 0,
    mechanicId: 0,
    serviceId: 0,
    appointmentDate: new Date(),
    status: 'scheduled',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  loading = false;
  error: string | null = null;
  appointmentId: number = 0;

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.appointmentId = +params['id'];
      if (this.appointmentId) {
        this.loadAppointment();
      }
    });
  }

  loadAppointment() {
    this.loading = true;
    this.error = null;
    
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (appointment: Appointment | undefined) => {
        if (appointment) {
          this.appointment = appointment;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar la cita';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    
    this.appointmentService.updateAppointment(this.appointmentId, this.appointment).subscribe({
      next: (response) => {
        console.log('Cita actualizada exitosamente:', response);
        this.router.navigate(['/appointments']);
      },
      error: (error: any) => {
        this.error = 'Error al actualizar la cita';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  cancel() {
    this.router.navigate(['/appointments']);
  }
}
