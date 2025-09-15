import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WorkOrderI } from '../models/work-order.model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  
  private workOrders: WorkOrderI[] = [
    {
      id: 1,
      clientId: 1,
      vehicleId: 1,
      mechanicId: 1,
      serviceId: 1,
      description: 'El vehículo presenta ruidos extraños en el motor',
      status: 'in-progress',
      priority: 'high',
      estimatedHours: 4,
      actualHours: 3,
      laborCost: 180000,
      partsCost: 250000,
      totalCost: 430000,
      startDate: new Date('2024-08-10'),
      endDate: new Date('2024-08-12'),
      notes: 'Diagnóstico completado, requiere cambio de bujías',
      createdAt: new Date('2024-08-10'),
      updatedAt: new Date('2024-08-10')
    },
    {
      id: 2,
      clientId: 2,
      vehicleId: 2,
      mechanicId: 2,
      serviceId: 2,
      description: 'Cambio de pastillas de freno y revisión del sistema',
      status: 'completed',
      priority: 'medium',
      estimatedHours: 2,
      actualHours: 2,
      laborCost: 80000,
      partsCost: 120000,
      totalCost: 200000,
      startDate: new Date('2024-08-12'),
      endDate: new Date('2024-08-12'),
      notes: 'Trabajo completado exitosamente',
      createdAt: new Date('2024-08-12'),
      updatedAt: new Date('2024-08-12')
    },
    {
      id: 3,
      clientId: 3,
      vehicleId: 3,
      mechanicId: 3,
      serviceId: 3,
      description: 'Cambio de aceite y filtro completado',
      status: 'completed',
      priority: 'low',
      estimatedHours: 1,
      actualHours: 1,
      laborCost: 30000,
      partsCost: 45000,
      totalCost: 75000,
      startDate: new Date('2024-08-13'),
      endDate: new Date('2024-08-13'),
      notes: 'Mantenimiento preventivo completado',
      createdAt: new Date('2024-08-13'),
      updatedAt: new Date('2024-08-13')
    }
  ];

  constructor() { }

  getWorkOrders(): Observable<WorkOrderI[]> {
    return of(this.workOrders);
  }

  getWorkOrderById(id: number): Observable<WorkOrderI | undefined> {
    const workOrder = this.workOrders.find(o => o.id === id);
    return of(workOrder);
  }

  getWorkOrdersByVehicleId(vehicleId: number): Observable<WorkOrderI[]> {
    const workOrders = this.workOrders.filter(o => o.vehicleId === vehicleId);
    return of(workOrders);
  }

  getWorkOrdersByMechanicId(mechanicId: number): Observable<WorkOrderI[]> {
    const workOrders = this.workOrders.filter(o => o.mechanicId === mechanicId);
    return of(workOrders);
  }

  createWorkOrder(workOrder: WorkOrderI): Observable<WorkOrderI> {
    const newWorkOrder: WorkOrderI = {
      ...workOrder,
      id: this.workOrders.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.workOrders.push(newWorkOrder);
    return of(newWorkOrder);
  }

  updateWorkOrder(id: number, workOrder: WorkOrderI): Observable<WorkOrderI> {
    const index = this.workOrders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.workOrders[index] = {
        ...workOrder,
        id,
        updatedAt: new Date()
      };
      return of(this.workOrders[index]);
    }
    throw new Error('Work order not found');
  }

  deleteWorkOrder(id: number): Observable<void> {
    const index = this.workOrders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.workOrders.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Work order not found');
  }

  updateStatus(id: number, status: 'pending' | 'in-progress' | 'completed' | 'cancelled'): Observable<WorkOrderI> {
    const workOrder = this.workOrders.find(o => o.id === id);
    if (workOrder) {
      workOrder.status = status;
      workOrder.updatedAt = new Date();
      return of(workOrder);
    }
    throw new Error('Work order not found');
  }
}
