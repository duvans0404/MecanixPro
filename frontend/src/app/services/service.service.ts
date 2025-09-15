import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceI } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  
  private services: ServiceI[] = [
    {
      id: 1,
      name: 'Cambio de Aceite',
      description: 'Cambio de aceite y filtro del motor',
      category: 'Mantenimiento',
      price: 50000,
      laborCost: 50000,
      durationMinutes: 30,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Frenos',
      description: 'Revisión y ajuste del sistema de frenos',
      category: 'Reparación',
      price: 80000,
      laborCost: 80000,
      durationMinutes: 60,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 3,
      name: 'Suspensión',
      description: 'Revisión y reparación del sistema de suspensión',
      category: 'Reparación',
      price: 120000,
      laborCost: 120000,
      durationMinutes: 120,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 4,
      name: 'Motor',
      description: 'Diagnóstico y reparación del motor',
      category: 'Reparación',
      price: 200000,
      laborCost: 200000,
      durationMinutes: 240,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  constructor() { }

  getServices(): Observable<ServiceI[]> {
    return of(this.services);
  }

  getService(id: string): Observable<ServiceI | undefined> {
    const service = this.services.find(s => s.id.toString() === id);
    return of(service);
  }

  getServiceById(id: number): Observable<ServiceI | undefined> {
    const service = this.services.find(s => s.id === id);
    return of(service);
  }

  addService(service: any): Observable<ServiceI> {
    const newService: ServiceI = {
      ...service,
      id: this.services.length + 1,
      laborCost: service.price,
      status: service.active ? 'ACTIVE' : 'INACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.services.push(newService);
    return of(newService);
  }

  createService(service: ServiceI): Observable<ServiceI> {
    const newService: ServiceI = {
      ...service,
      id: this.services.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.services.push(newService);
    return of(newService);
  }

  updateService(id: string, service: any): Observable<ServiceI> {
    const serviceId = parseInt(id);
    const index = this.services.findIndex(s => s.id === serviceId);
    if (index !== -1) {
      this.services[index] = {
        ...this.services[index],
        ...service,
        id: serviceId,
        laborCost: service.price,
        status: service.active ? 'ACTIVE' : 'INACTIVE',
        updatedAt: new Date()
      };
      return of(this.services[index]);
    }
    throw new Error('Service not found');
  }

  deleteService(id: string): Observable<void> {
    const serviceId = parseInt(id);
    const index = this.services.findIndex(s => s.id === serviceId);
    if (index !== -1) {
      this.services.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Service not found');
  }
}
