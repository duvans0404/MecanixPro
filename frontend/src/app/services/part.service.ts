import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PartI } from '../models/part.model';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  
  private parts: PartI[] = [
    {
      id: 1,
      name: 'Aceite de Motor',
      description: 'Aceite sintético 5W-30 para motores de gasolina',
      partNumber: 'OIL-001',
      brand: 'Mobil',
      unitPrice: 45000,
      price: 45000,
      stock: 50,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Filtro de Aceite',
      description: 'Filtro de aceite compatible con múltiples marcas',
      partNumber: 'FIL-002',
      brand: 'Bosch',
      unitPrice: 15000,
      price: 15000,
      stock: 30,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 3,
      name: 'Pastillas de Freno',
      description: 'Pastillas de freno delanteras para vehículos compactos',
      partNumber: 'BRA-003',
      brand: 'Brembo',
      unitPrice: 35000,
      price: 35000,
      stock: 25,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 4,
      name: 'Bujías',
      description: 'Bujías de encendido de platino',
      partNumber: 'SPA-004',
      brand: 'NGK',
      unitPrice: 25000,
      price: 25000,
      stock: 40,
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  constructor() { }

  getParts(): Observable<PartI[]> {
    return of(this.parts);
  }

  getPart(id: string): Observable<PartI | undefined> {
    const part = this.parts.find(r => r.id.toString() === id);
    return of(part);
  }

  getPartById(id: number): Observable<PartI | undefined> {
    const part = this.parts.find(r => r.id === id);
    return of(part);
  }

  addPart(part: any): Observable<PartI> {
    const newPart: PartI = {
      ...part,
      id: this.parts.length + 1,
      unitPrice: part.price,
      status: part.active ? 'ACTIVE' : 'INACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.parts.push(newPart);
    return of(newPart);
  }

  createPart(part: PartI): Observable<PartI> {
    const newPart: PartI = {
      ...part,
      id: this.parts.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.parts.push(newPart);
    return of(newPart);
  }

  updatePart(id: string, part: any): Observable<PartI> {
    const partId = parseInt(id);
    const index = this.parts.findIndex(r => r.id === partId);
    if (index !== -1) {
      this.parts[index] = {
        ...this.parts[index],
        ...part,
        id: partId,
        unitPrice: part.price,
        status: part.active ? 'ACTIVE' : 'INACTIVE',
        updatedAt: new Date()
      };
      return of(this.parts[index]);
    }
    throw new Error('Part not found');
  }

  deletePart(id: string): Observable<void> {
    const partId = parseInt(id);
    const index = this.parts.findIndex(r => r.id === partId);
    if (index !== -1) {
      this.parts.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Part not found');
  }

  updateStock(id: number, quantity: number): Observable<PartI> {
    const part = this.parts.find(r => r.id === id);
    if (part) {
      part.stock = quantity;
      part.updatedAt = new Date();
      return of(part);
    }
    throw new Error('Part not found');
  }
}
