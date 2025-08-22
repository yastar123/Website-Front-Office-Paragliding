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

export interface Weather {
  id: string;
  date: string;
  time: string;
  windSpeed: number; // km/h
  windDirection: string;
  temperature: number; // celsius
  humidity: number; // percentage
  visibility: number; // km
  conditions: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous';
  flyable: boolean;
  notes?: string;
  createdAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'helmet' | 'harness' | 'reserve' | 'radio' | 'gps' | 'other';
  brand: string;
  model: string;
  serialNumber: string;
  condition: 'excellent' | 'good' | 'fair' | 'needs-repair';
  lastInspection: string;
  nextInspection: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  assignedTo?: string; // pilot id
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  weight: number;
  height: number;
  experience: 'none' | 'beginner' | 'intermediate' | 'advanced';
  medicalConditions?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  totalFlights: number;
  lastFlight?: string;
  notes?: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  itemId: string;
  itemType: 'glider' | 'equipment';
  type: 'routine' | 'repair' | 'inspection' | 'replacement';
  description: string;
  performedBy: string;
  date: string;
  cost: number;
  nextDue?: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  notes?: string;
  createdAt: string;
}