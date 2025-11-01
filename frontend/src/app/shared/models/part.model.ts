export interface PartI {
  id: number;
  name: string;
  description: string;
  partNumber: string;
  brand: string;
  unitPrice: number;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Alias para compatibilidad
export type Part = PartI;
