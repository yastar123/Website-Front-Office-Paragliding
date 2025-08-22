import { Pilot, Glider, Agent, FlightPackage, Reservation, User } from '../types';
import { Weather, Equipment, Customer, Maintenance } from '../types';
import { dummyPilots, dummyGliders, dummyAgents, dummyPackages, dummyReservations, dummyWeather, dummyEquipment, dummyCustomers, dummyMaintenance } from '../data/dummy';

const STORAGE_KEYS = {
  PILOTS: 'paragliding_pilots',
  GLIDERS: 'paragliding_gliders',
  AGENTS: 'paragliding_agents',
  PACKAGES: 'paragliding_packages',
  RESERVATIONS: 'paragliding_reservations',
  USER: 'paragliding_user',
  WEATHER: 'paragliding_weather',
  EQUIPMENT: 'paragliding_equipment',
  CUSTOMERS: 'paragliding_customers',
  MAINTENANCE: 'paragliding_maintenance'
};

export const initializeStorage = () => {
  // Initialize with dummy data if not exists
  if (!localStorage.getItem(STORAGE_KEYS.PILOTS)) {
    localStorage.setItem(STORAGE_KEYS.PILOTS, JSON.stringify(dummyPilots));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GLIDERS)) {
    localStorage.setItem(STORAGE_KEYS.GLIDERS, JSON.stringify(dummyGliders));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AGENTS)) {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(dummyAgents));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(dummyPackages));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(dummyReservations));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WEATHER)) {
    localStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EQUIPMENT)) {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MAINTENANCE)) {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify([]));
  }
};

export const storageService = {
  // Pilots
  getPilots: (): Pilot[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PILOTS);
    return data ? JSON.parse(data) : [];
  },
  savePilots: (pilots: Pilot[]) => {
    localStorage.setItem(STORAGE_KEYS.PILOTS, JSON.stringify(pilots));
  },

  // Gliders
  getGliders: (): Glider[] => {
    const data = localStorage.getItem(STORAGE_KEYS.GLIDERS);
    return data ? JSON.parse(data) : [];
  },
  saveGliders: (gliders: Glider[]) => {
    localStorage.setItem(STORAGE_KEYS.GLIDERS, JSON.stringify(gliders));
  },

  // Agents
  getAgents: (): Agent[] => {
    const data = localStorage.getItem(STORAGE_KEYS.AGENTS);
    return data ? JSON.parse(data) : [];
  },
  saveAgents: (agents: Agent[]) => {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
  },

  // Packages
  getPackages: (): FlightPackage[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    return data ? JSON.parse(data) : [];
  },
  savePackages: (packages: FlightPackage[]) => {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
  },

  // Reservations
  getReservations: (): Reservation[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return data ? JSON.parse(data) : [];
  },
  saveReservations: (reservations: Reservation[]) => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  },

  // User
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  saveUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  // Weather
  getWeather: (): Weather[] => {
    const data = localStorage.getItem(STORAGE_KEYS.WEATHER);
    return data ? JSON.parse(data) : [];
  },
  saveWeather: (weather: Weather[]) => {
    localStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify(weather));
  },

  // Equipment
  getEquipment: (): Equipment[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    return data ? JSON.parse(data) : [];
  },
  saveEquipment: (equipment: Equipment[]) => {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
  },

  // Customers
  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },
  saveCustomers: (customers: Customer[]) => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  // Maintenance
  getMaintenance: (): Maintenance[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
    return data ? JSON.parse(data) : [];
  },
  saveMaintenance: (maintenance: Maintenance[]) => {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenance));
  }
};