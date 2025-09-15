export interface MechanicI {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: number;
  hourlyRate: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Alias para compatibilidad
export type Mechanic = MechanicI;
