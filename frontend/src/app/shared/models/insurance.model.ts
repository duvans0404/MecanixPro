export interface InsuranceI {
  id: number;
  vehicleId: number;
  companyName: string;
  policyNumber: string;
  coverageType: string;
  startDate: Date;
  endDate: Date;
  premium: number;
  deductible: number;
  createdAt: Date;
  updatedAt: Date;
}

// Alias para compatibilidad
export type Insurance = InsuranceI;
