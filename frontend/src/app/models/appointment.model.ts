export interface AppointmentI {
  id: number;
  clientId: number;
  vehicleId: number;
  mechanicId: number;
  serviceId: number;
  appointmentDate: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Alias para compatibilidad
export type Appointment = AppointmentI;
