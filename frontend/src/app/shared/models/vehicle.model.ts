export interface VehicleI {
  id: number;
  licensePlate: string;
  make: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  clientId: number;
  insuranceId?: number;
  status: 'ACTIVE' | 'INACTIVE';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleCompleteI extends VehicleI {
  client?: ClientI;
  insurance?: InsuranceI;
  workOrders?: WorkOrderI[];
}

// Alias para compatibilidad
export type Vehicle = VehicleI;
export type VehicleComplete = VehicleCompleteI;

// Import types for extended interfaces
import { ClientI } from './client.model';
import { InsuranceI } from './insurance.model';
import { WorkOrderI } from './work-order.model';
