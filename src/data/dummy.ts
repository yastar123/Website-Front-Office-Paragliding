import { Pilot, Glider, Agent, FlightPackage, Reservation } from '../types';
import { Weather, Equipment, Customer, Maintenance } from '../types';

export const dummyPilots: Pilot[] = [
  {
    id: '1',
    name: 'Marco Rodriguez',
    license: 'APPI-P3',
    experience: 8,
    rating: 5,
    status: 'available'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    license: 'USHPA-P4',
    experience: 12,
    rating: 5,
    status: 'available'
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    license: 'APPI-P2',
    experience: 5,
    rating: 4,
    status: 'busy'
  },
  {
    id: '4',
    name: 'Elena Petrov',
    license: 'FAI-P3',
    experience: 10,
    rating: 5,
    status: 'available'
  }
];

export const dummyGliders: Glider[] = [
  {
    id: '1',
    brand: 'Ozone',
    model: 'Rush 5',
    size: 'M',
    condition: 'excellent',
    lastMaintenance: '2024-12-01',
    status: 'available'
  },
  {
    id: '2',
    brand: 'Nova',
    model: 'Mentor 6',
    size: 'L',
    condition: 'good',
    lastMaintenance: '2024-11-15',
    status: 'available'
  },
  {
    id: '3',
    brand: 'Gradient',
    model: 'Aspen 6',
    size: 'S',
    condition: 'excellent',
    lastMaintenance: '2024-12-10',
    status: 'in-use'
  },
  {
    id: '4',
    brand: 'Advance',
    model: 'Alpha 7',
    size: 'M',
    condition: 'good',
    lastMaintenance: '2024-11-20',
    status: 'available'
  }
];

export const dummyAgents: Agent[] = [
  {
    id: '1',
    name: 'Adventure Tours Bali',
    email: 'info@adventurebali.com',
    phone: '+62-361-123456',
    commission: 15,
    status: 'active'
  },
  {
    id: '2',
    name: 'Sky High Adventures',
    email: 'bookings@skyhigh.com',
    phone: '+62-361-654321',
    commission: 12,
    status: 'active'
  },
  {
    id: '3',
    name: 'Paragliding Pro',
    email: 'contact@pgpro.com',
    phone: '+62-361-987654',
    commission: 18,
    status: 'active'
  }
];

export const dummyPackages: FlightPackage[] = [
  {
    id: '1',
    name: 'Sunset Tandem Flight',
    duration: 30,
    price: 1200000, // IDR
    description: 'Beautiful sunset flight over the cliffs with professional pilot',
    difficulty: 'beginner',
    maxWeight: 100
  },
  {
    id: '2',
    name: 'High Altitude Adventure',
    duration: 45,
    price: 1800000,
    description: 'Extended high altitude flight with aerobatics option',
    difficulty: 'intermediate',
    maxWeight: 95
  },
  {
    id: '3',
    name: 'Beach Landing Experience',
    duration: 25,
    price: 1000000,
    description: 'Scenic flight ending with beach landing',
    difficulty: 'beginner',
    maxWeight: 105
  },
  {
    id: '4',
    name: 'Photography Flight',
    duration: 40,
    price: 1500000,
    description: 'Professional photography session during flight',
    difficulty: 'beginner',
    maxWeight: 90
  }
];

export const dummyReservations: Reservation[] = [
  {
    id: '1',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1-555-0123',
    date: '2025-01-15',
    time: '09:00',
    packageId: '1',
    agentId: '1',
    pilotId: '1',
    gliderId: '1',
    status: 'confirmed',
    totalPrice: 1200000,
    createdAt: '2025-01-10T10:30:00Z'
  },
  {
    id: '2',
    customerName: 'Maria Garcia',
    customerEmail: 'maria.garcia@email.com',
    customerPhone: '+34-600-123456',
    date: '2025-01-15',
    time: '11:30',
    packageId: '2',
    agentId: '2',
    pilotId: '2',
    gliderId: '2',
    status: 'checked-in',
    totalPrice: 1800000,
    createdAt: '2025-01-12T14:20:00Z'
  },
  {
    id: '3',
    customerName: 'David Kim',
    customerEmail: 'david.kim@email.com',
    customerPhone: '+82-10-1234-5678',
    date: '2025-01-16',
    time: '15:00',
    packageId: '3',
    agentId: '1',
    pilotId: '4',
    gliderId: '4',
    status: 'pending',
    totalPrice: 1000000,
    createdAt: '2025-01-13T09:15:00Z'
  }
];

export const dummyWeather: Weather[] = [
  {
    id: '1',
    date: '2025-01-15',
    time: '08:00',
    windSpeed: 12,
    windDirection: 'NW',
    temperature: 28,
    humidity: 65,
    visibility: 15,
    conditions: 'good',
    flyable: true,
    notes: 'Kondisi baik untuk penerbangan pagi',
    createdAt: '2025-01-15T08:00:00Z'
  },
  {
    id: '2',
    date: '2025-01-15',
    time: '14:00',
    windSpeed: 18,
    windDirection: 'W',
    temperature: 32,
    humidity: 70,
    visibility: 12,
    conditions: 'fair',
    flyable: true,
    notes: 'Angin agak kencang, cocok untuk pilot berpengalaman',
    createdAt: '2025-01-15T14:00:00Z'
  }
];

export const dummyEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Helmet Pro X1',
    type: 'helmet',
    brand: 'Charly',
    model: 'Insider',
    serialNumber: 'CH-2023-001',
    condition: 'excellent',
    lastInspection: '2024-12-01',
    nextInspection: '2025-06-01',
    status: 'available'
  },
  {
    id: '2',
    name: 'Harness Comfort Plus',
    type: 'harness',
    brand: 'Advance',
    model: 'Lightness 3',
    serialNumber: 'ADV-2023-002',
    condition: 'good',
    lastInspection: '2024-11-15',
    nextInspection: '2025-05-15',
    status: 'in-use',
    assignedTo: '1'
  },
  {
    id: '3',
    name: 'Reserve Parachute',
    type: 'reserve',
    brand: 'Gin',
    model: 'Yeti Cross',
    serialNumber: 'GIN-2023-003',
    condition: 'excellent',
    lastInspection: '2024-12-10',
    nextInspection: '2025-06-10',
    status: 'available'
  }
];

export const dummyCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    dateOfBirth: '1985-03-15',
    weight: 75,
    height: 175,
    experience: 'none',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '+1-555-0124',
      relationship: 'Wife'
    },
    totalFlights: 0,
    createdAt: '2025-01-10T10:30:00Z'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+34-600-123456',
    dateOfBirth: '1990-07-22',
    weight: 62,
    height: 165,
    experience: 'beginner',
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '+34-600-123457',
      relationship: 'Husband'
    },
    totalFlights: 3,
    lastFlight: '2024-12-20',
    createdAt: '2025-01-12T14:20:00Z'
  }
];

export const dummyMaintenance: Maintenance[] = [
  {
    id: '1',
    itemId: '1',
    itemType: 'glider',
    type: 'routine',
    description: 'Pemeriksaan rutin bulanan - cek line, fabric, dan hardware',
    performedBy: 'Ahmad Teknisi',
    date: '2024-12-01',
    cost: 500000,
    nextDue: '2025-01-01',
    status: 'completed',
    notes: 'Semua komponen dalam kondisi baik',
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    itemId: '2',
    itemType: 'equipment',
    type: 'inspection',
    description: 'Inspeksi harness dan sistem keselamatan',
    performedBy: 'Budi Mekanik',
    date: '2024-11-15',
    cost: 200000,
    nextDue: '2025-05-15',
    status: 'completed',
    createdAt: '2024-11-15T14:30:00Z'
  }
];