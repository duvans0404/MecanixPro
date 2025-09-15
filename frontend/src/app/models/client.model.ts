export interface ClientI {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  password?: string;
  status: 'ACTIVE' | 'INACTIVE';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientCompleteI extends ClientI {
  vehicles?: VehicleI[];
  appointments?: AppointmentI[];
  workOrders?: WorkOrderI[];
}

// Alias para compatibilidad
export type Client = ClientI;
export type ClientComplete = ClientCompleteI;

// Import types for extended interfaces
import { VehicleI } from './vehicle.model';
import { AppointmentI } from './appointment.model';
import { WorkOrderI } from './work-order.model';
