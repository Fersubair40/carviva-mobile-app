export interface Transaction {
  id: string;
  stationId: string;
  pumpId: string;
  fuelType: string;
  amount: number; // in liters
  price: number; // per liter
  totalPrice: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
  attendantId: string;
  customerId?: string;
  fuelToken: string;
  dispenseToken: string;
}