export interface PaymentI {
  id: number;
  workOrderId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Alias para compatibilidad
export type Payment = PaymentI;
