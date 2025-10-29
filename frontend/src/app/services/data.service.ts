import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  ClientI, 
  VehicleI, 
  WorkOrderI, 
  ServiceI, 
  PartI, 
  MechanicI,
  WorkOrderCompleteI 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  // Datos de ejemplo para el frontend
  private clientes: ClientI[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      address: 'Calle 123 #45-67, Bogotá',
      phone: '300-123-4567',
      email: 'juan.perez@email.com',
      password: 'password123',
      status: 'ACTIVE',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'María González',
      address: 'Carrera 78 #90-12, Medellín',
      phone: '310-987-6543',
      email: 'maria.gonzalez@email.com',
      password: 'password123',
      status: 'ACTIVE',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      address: 'Avenida 56 #34-89, Cali',
      phone: '315-555-1234',
      email: 'carlos.rodriguez@email.com',
      password: 'password123',
      status: 'ACTIVE',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private vehiculos: VehicleI[] = [
    {
      id: 1,
      licensePlate: 'ABC123',
      make: 'Toyota',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      color: 'Blanco',
      vin: '1HGBH41JXMN109186',
      clientId: 1,
      insuranceId: 1,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      licensePlate: 'XYZ789',
      make: 'Honda',
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
      color: 'Azul',
      vin: '2HGBH41JXMN109187',
      clientId: 2,
      insuranceId: 2,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private servicios: ServiceI[] = [
    {
      id: 1,
      name: 'Cambio de aceite',
      description: 'Cambio de aceite y filtro',
      category: 'Mantenimiento',
      price: 50000,
      laborCost: 50000,
      durationMinutes: 30,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Revisión general',
      description: 'Revisión completa del vehículo',
      category: 'Diagnóstico',
      price: 100000,
      laborCost: 100000,
      durationMinutes: 60,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private repuestos: PartI[] = [
    {
      id: 1,
      name: 'Filtro de aceite',
      description: 'Filtro de aceite para motor',
      partNumber: 'FIL-001',
      brand: 'Bosch',
      unitPrice: 25000,
      price: 25000,
      stock: 50,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Pastillas de freno',
      description: 'Pastillas de freno delanteras',
      partNumber: 'BRA-002',
      brand: 'Brembo',
      unitPrice: 80000,
      price: 80000,
      stock: 20,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private mecanicos: MechanicI[] = [
    {
      id: 1,
      firstName: 'Pedro',
      lastName: 'Martínez',
      email: 'pedro.martinez@taller.com',
      phone: '300-111-2222',
      specialization: 'engine',
      experienceYears: 7,
      hourlyRate: 43000,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      firstName: 'Ana',
      lastName: 'López',
      email: 'ana.lopez@taller.com',
      phone: '300-333-4444',
      specialization: 'brakes',
      experienceYears: 4,
      hourlyRate: 38000,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private ordenesTrabajo: WorkOrderI[] = [
    {
      id: 1,
      clientId: 1,
      vehicleId: 1,
      mechanicId: 1,
      serviceId: 1,
      description: 'Revisión de motor',
      status: 'in-progress',
      priority: 'medium',
      estimatedHours: 2,
      actualHours: 1.5,
      laborCost: 50000,
      partsCost: 25000,
      totalCost: 75000,
      startDate: new Date(),
      endDate: new Date(),
      notes: 'Diagnóstico en progreso',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private appointments = [
    {
      id: 1,
      clientId: 1,
      serviceName: 'Cambio de aceite',
      date: new Date(Date.now() + 86400000),
      status: 'SCHEDULED',
    },
    {
      id: 2,
      clientId: 2,
      serviceName: 'Revisión general',
      date: new Date(Date.now() + 2*86400000),
      status: 'SCHEDULED',
    },
    {
      id: 3,
      clientId: 3,
      serviceName: 'Alineación y balanceo',
      date: new Date(Date.now() - 86400000),
      status: 'COMPLETED',
    }
  ];

  // Métodos para obtener datos
  getClientes(): Observable<ClientI[]> {
    return of(this.clientes);
  }

  getVehiculos(): Observable<VehicleI[]> {
    return of(this.vehiculos);
  }

  getServicios(): Observable<ServiceI[]> {
    return of(this.servicios);
  }

  getRepuestos(): Observable<PartI[]> {
    return of(this.repuestos);
  }

  getMecanicos(): Observable<MechanicI[]> {
    return of(this.mecanicos);
  }

  getOrdenesTrabajo(): Observable<WorkOrderI[]> {
    return of(this.ordenesTrabajo);
  }

  getAppointments(): Observable<any[]> {
    return of(this.appointments);
  }

  // Métodos para obtener estadísticas del dashboard
  getTotalClientes(): Observable<number> {
    return of(this.clientes.length);
  }

  getTotalVehiculos(): Observable<number> {
    return of(this.vehiculos.length);
  }

  getOrdenesPendientes(): Observable<number> {
    return of(this.ordenesTrabajo.filter(ot => ot.status === 'pending' || ot.status === 'in-progress').length);
  }

  getOrdenesCompletadas(): Observable<number> {
    return of(this.ordenesTrabajo.filter(ot => ot.status === 'completed').length);
  }

  getTotalServicios(): Observable<number> {
    return of(this.servicios.length);
  }

  getTotalRepuestos(): Observable<number> {
    return of(this.repuestos.reduce((total, repuesto) => total + repuesto.stock, 0));
  }

  // Nuevas estadísticas para el dashboard
  getTotalAppointments(): Observable<number> {
    return of(3); // Datos de ejemplo
  }

  getTotalInsurance(): Observable<number> {
    return of(3); // Datos de ejemplo
  }

  getTotalMechanics(): Observable<number> {
    return of(this.mecanicos.length);
  }

  getTotalPayments(): Observable<number> {
    return of(3); // Datos de ejemplo
  }

  getTotalWorkOrders(): Observable<number> {
    return of(this.ordenesTrabajo.length);
  }

  // Métodos auxiliares para el dashboard
  getClienteName(vehicleId: number): string {
    const vehiculo = this.vehiculos.find(v => v.id === vehicleId);
    if (vehiculo) {
      const cliente = this.clientes.find(c => c.id === vehiculo.clientId);
      return cliente ? cliente.name : 'N/A';
    }
    return 'N/A';
  }

  getVehiculoInfo(vehicleId: number): string {
    const vehiculo = this.vehiculos.find(v => v.id === vehicleId);
    if (vehiculo) {
      return `${vehiculo.brand} ${vehiculo.model} (${vehiculo.licensePlate})`;
    }
    return 'N/A';
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'DIAGNOSTIC':
        return 'badge-warning';
      case 'REPAIR':
        return 'badge-info';
      case 'READY':
        return 'badge-success';
      case 'COMPLETED':
        return 'badge-primary';
      default:
        return 'badge-secondary';
    }
  }

  getEstadoText(estado: string): string {
    switch (estado) {
      case 'DIAGNOSTIC':
        return 'Diagnóstico';
      case 'REPAIR':
        return 'Reparación';
      case 'READY':
        return 'Listo';
      case 'COMPLETED':
        return 'Completado';
      default:
        return estado;
    }
  }
}