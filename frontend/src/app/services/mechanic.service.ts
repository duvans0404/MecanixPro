import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MechanicI } from '../models/mechanic.model';

@Injectable({
  providedIn: 'root'
})
export class MechanicService {
  
  private mechanics: MechanicI[] = [
    {
      id: 1,
      firstName: 'Roberto',
      lastName: 'Silva',
      email: 'roberto.silva@taller.com',
      phone: '300-111-2222',
      specialization: 'engine',
      experienceYears: 8,
      hourlyRate: 45000,
      isAvailable: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      firstName: 'Luis',
      lastName: 'Mendoza',
      email: 'luis.mendoza@taller.com',
      phone: '300-333-4444',
      specialization: 'brakes',
      experienceYears: 5,
      hourlyRate: 40000,
      isAvailable: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 3,
      firstName: 'Diego',
      lastName: 'Ramírez',
      email: 'diego.ramirez@taller.com',
      phone: '300-555-6666',
      specialization: 'electrical',
      experienceYears: 6,
      hourlyRate: 42000,
      isAvailable: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  constructor() { }

  getMechanics(): Observable<MechanicI[]> {
    return of(this.mechanics);
  }

  getMechanicById(id: number): Observable<MechanicI | undefined> {
    const mechanic = this.mechanics.find(m => m.id === id);
    return of(mechanic);
  }

  createMechanic(mechanic: MechanicI): Observable<MechanicI> {
    const newMechanic: MechanicI = {
      ...mechanic,
      id: this.mechanics.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mechanics.push(newMechanic);
    return of(newMechanic);
  }

  updateMechanic(id: number, mechanic: MechanicI): Observable<MechanicI> {
    const index = this.mechanics.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mechanics[index] = {
        ...mechanic,
        id,
        updatedAt: new Date()
      };
      return of(this.mechanics[index]);
    }
    throw new Error('Mechanic not found');
  }

  deleteMechanic(id: number): Observable<void> {
    const index = this.mechanics.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mechanics.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Mechanic not found');
  }
}
