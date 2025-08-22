export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Pilot {
  id: string;
  name: string;
  license: string;
  experience: number; // years
  rating: number; // 1-5
  status: 'available' | 'busy' | 'off-duty';
}

export interface Glider {
  id: string;
  brand: string;
  model: string;
  size: string;
  condition: 'excellent' | 'good' | 'fair';
  lastMaintenance: string;
  status: 'available' | 'in-use' | 'maintenance';
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  commission: number; // percentage
  status: 'active' | 'inactive';
}

export interface FlightPackage {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maxWeight: number; // kg
}

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  packageId: string;
  agentId: string;
  pilotId: string;
  gliderId: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'completed' | 'cancelled';
  totalPrice: number;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalReservations: number;
  todayReservations: number;
  revenue: number;
  checkIns: number;
}