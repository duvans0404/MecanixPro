import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VehicleI } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  
  private vehicles: VehicleI[] = [
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
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      licensePlate: 'XYZ789',
      make: 'Honda',
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
      color: 'Negro',
      vin: '2HGBH41JXMN109187',
      clientId: 2,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: 3,
      licensePlate: 'DEF456',
      make: 'Ford',
      brand: 'Ford',
      model: 'Focus',
      year: 2021,
      color: 'Azul',
      vin: '3HGBH41JXMN109188',
      clientId: 3,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-05')
    }
  ];

  constructor() { }

  getVehicles(): Observable<VehicleI[]> {
    return of(this.vehicles);
  }

  getVehicle(id: string): Observable<VehicleI | undefined> {
    const vehicle = this.vehicles.find(v => v.id.toString() === id);
    return of(vehicle);
  }

  getVehicleById(id: number): Observable<VehicleI | undefined> {
    const vehicle = this.vehicles.find(v => v.id === id);
    return of(vehicle);
  }

  getVehiclesByClientId(clientId: number): Observable<VehicleI[]> {
    const vehicles = this.vehicles.filter(v => v.clientId === clientId);
    return of(vehicles);
  }

  addVehicle(vehicle: any): Observable<VehicleI> {
    const newVehicle: VehicleI = {
      ...vehicle,
      id: this.vehicles.length + 1,
      clientId: parseInt(vehicle.clientId),
      status: vehicle.active ? 'ACTIVE' : 'INACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.vehicles.push(newVehicle);
    return of(newVehicle);
  }

  createVehicle(vehicle: VehicleI): Observable<VehicleI> {
    const newVehicle: VehicleI = {
      ...vehicle,
      id: this.vehicles.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.vehicles.push(newVehicle);
    return of(newVehicle);
  }

  updateVehicle(id: string, vehicle: any): Observable<VehicleI> {
    const vehicleId = parseInt(id);
    const index = this.vehicles.findIndex(v => v.id === vehicleId);
    if (index !== -1) {
      this.vehicles[index] = {
        ...this.vehicles[index],
        ...vehicle,
        id: vehicleId,
        clientId: parseInt(vehicle.clientId),
        status: vehicle.active ? 'ACTIVE' : 'INACTIVE',
        updatedAt: new Date()
      };
      return of(this.vehicles[index]);
    }
    throw new Error('Vehicle not found');
  }

  deleteVehicle(id: string): Observable<void> {
    const vehicleId = parseInt(id);
    const index = this.vehicles.findIndex(v => v.id === vehicleId);
    if (index !== -1) {
      this.vehicles.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Vehicle not found');
  }
}
