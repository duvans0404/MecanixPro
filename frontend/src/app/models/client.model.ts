export interface ClientI {
  id: number;
  name: string;
  documentType?: string;
  documentNumber?: string;
  birthDate?: string | Date;
  address: string;
  phone: string;
  alternativePhone?: string;
  email: string;
  password?: string;
  status: 'ACTIVE' | 'INACTIVE';
  active: boolean;
  isVip?: boolean;
  notes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  avatar?: string | null;
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
