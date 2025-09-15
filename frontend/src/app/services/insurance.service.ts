import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InsuranceI } from '../models/insurance.model';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  
  private insurances: InsuranceI[] = [
    {
      id: 1,
      vehicleId: 1,
      companyName: 'Seguros Bolívar',
      policyNumber: 'POL-2024-001',
      coverageType: 'full',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      premium: 1200000,
      deductible: 500000,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      vehicleId: 2,
      companyName: 'Sura Seguros',
      policyNumber: 'POL-2024-002',
      coverageType: 'liability',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-03-15'),
      premium: 800000,
      deductible: 300000,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 3,
      vehicleId: 3,
      companyName: 'Allianz Seguros',
      policyNumber: 'POL-2024-003',
      coverageType: 'comprehensive',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-11-20'),
      premium: 1500000,
      deductible: 700000,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  constructor() { }

  getInsurances(): Observable<InsuranceI[]> {
    return of(this.insurances);
  }

  getInsuranceById(id: number): Observable<InsuranceI | undefined> {
    const insurance = this.insurances.find(i => i.id === id);
    return of(insurance);
  }

  createInsurance(insurance: InsuranceI): Observable<InsuranceI> {
    const newInsurance: InsuranceI = {
      ...insurance,
      id: this.insurances.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.insurances.push(newInsurance);
    return of(newInsurance);
  }

  updateInsurance(id: number, insurance: InsuranceI): Observable<InsuranceI> {
    const index = this.insurances.findIndex(i => i.id === id);
    if (index !== -1) {
      this.insurances[index] = {
        ...insurance,
        id,
        updatedAt: new Date()
      };
      return of(this.insurances[index]);
    }
    throw new Error('Insurance not found');
  }

  deleteInsurance(id: number): Observable<void> {
    const index = this.insurances.findIndex(i => i.id === id);
    if (index !== -1) {
      this.insurances.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Insurance not found');
  }
}
