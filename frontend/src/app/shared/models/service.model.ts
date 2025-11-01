export interface ServiceI {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  laborCost: number;
  durationMinutes: number;
  status: 'ACTIVE' | 'INACTIVE';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Alias para compatibilidad
export type Service = ServiceI;
