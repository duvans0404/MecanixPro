export interface WorkOrderI {
  id: number;
  clientId: number;
  vehicleId: number;
  mechanicId: number;
  serviceId: number;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours: number;
  actualHours: number;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  startDate: Date;
  endDate: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrderServiceI {
  id: number;
  workOrderId: number;
  serviceId: number;
  hoursQuantity: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrderPartI {
  id: number;
  workOrderId: number;
  partId: number;
  quantity: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrderCompleteI extends WorkOrderI {
  vehicle?: VehicleI;
  client?: ClientI;
  mechanic?: MechanicI;
  services?: WorkOrderServiceI[];
  parts?: WorkOrderPartI[];
  totalServices?: number;
  totalParts?: number;
  totalGeneral?: number;
}

// Alias para compatibilidad
export type WorkOrder = WorkOrderI;
export type WorkOrderService = WorkOrderServiceI;
export type WorkOrderPart = WorkOrderPartI;
export type WorkOrderComplete = WorkOrderCompleteI;

// Import types for extended interfaces
import { VehicleI } from './vehicle.model';
import { ClientI } from './client.model';
import { MechanicI } from './mechanic.model';
