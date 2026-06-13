import { create } from 'zustand';
import {
  SOS,
  SOSStatus,
  WhoNeedsHelp,
  RespondingService,
  EmergencyContact,
} from '../types/sos.types';

interface SOSStore {
  sos: SOS;
  setStatus: (status: SOSStatus) => void;
  setWhoNeedsHelp: (who: WhoNeedsHelp) => void;
  setLocation: (location: SOS['location']) => void;
  triggerSOS: () => void;
  cancelSOS: () => void;
  setRespondingServices: (services: RespondingService[]) => void;
  setEmergencyContacts: (contacts: EmergencyContact[]) => void;
  setETA: (minutes: number) => void;
  setSessionId: (sessionId: string) => void;
  reset: () => void;
}

const MOCK_RESPONDING_SERVICES: RespondingService[] = [
  {
    id: '1',
    name: 'City Ambulance Service',
    type: 'ambulance',
    status: 'en_route',
    etaMinutes: 8,
    distanceKm: 1.5,
    phone: '+15559110000',
  },
  {
    id: '2',
    name: 'Downtown Police Station',
    type: 'police',
    status: 'dispatched',
    etaMinutes: 6,
    distanceKm: 0.8,
    phone: '+15559110001',
  },
];

const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Family',
    phone: '+1 (555) 123-4567',
    notified: true,
    avatarIcon: 'user',
  },
  {
    id: '2',
    name: 'Dr. Emily Davis',
    role: 'Primary Care',
    phone: '+1 (555) 987-6543',
    notified: true,
    avatarIcon: 'heart',
  },
];

const INITIAL_SOS: SOS = {
  id: '',
  sessionId: null,
  status: 'idle',
  whoNeedsHelp: null,
  location: null,
  respondingServices: [],
  emergencyContacts: [],
  triggeredAt: null,
  etaMinutes: null,
};

export const useSOSStore = create<SOSStore>((set) => ({
  sos: INITIAL_SOS,

  setStatus: (status) =>
    set((state) => ({ sos: { ...state.sos, status } })),

  setWhoNeedsHelp: (whoNeedsHelp) =>
    set((state) => ({ sos: { ...state.sos, whoNeedsHelp } })),

  setLocation: (location) =>
  set((state) => ({ sos: { ...state.sos, location } })),

  triggerSOS: () =>
    set((state) => ({
      sos: {
        ...state.sos,
        status: 'active',
        id: `sos-${Date.now()}`,
        triggeredAt: new Date(),
        respondingServices: MOCK_RESPONDING_SERVICES,
        emergencyContacts: MOCK_EMERGENCY_CONTACTS,
        etaMinutes: 8,
        
        
      },
    })),

  cancelSOS: () =>
    set((state) => ({
      sos: { ...state.sos, status: 'cancelled' },
    })),

  setRespondingServices: (respondingServices) =>
    set((state) => ({ sos: { ...state.sos, respondingServices } })),

  setEmergencyContacts: (emergencyContacts) =>
    set((state) => ({ sos: { ...state.sos, emergencyContacts } })),

  setETA: (etaMinutes) =>
    set((state) => ({ sos: { ...state.sos, etaMinutes } })),

  setSessionId: (sessionId) =>
  set((state) => ({ sos: { ...state.sos, sessionId } })),

  reset: () => set({ sos: INITIAL_SOS }),
}));
