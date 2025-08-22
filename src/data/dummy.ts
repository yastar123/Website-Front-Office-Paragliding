import { Pilot, Glider, Agent, FlightPackage, Reservation } from '../types';

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