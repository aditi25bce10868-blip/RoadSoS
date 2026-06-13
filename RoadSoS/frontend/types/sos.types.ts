export type SOSStatus = 'idle' | 'countdown' | 'active' | 'cancelled';

export type WhoNeedsHelp = 'self' | 'other' | null;

export type ServiceStatus = 'en_route' | 'dispatched' | 'arrived';

export interface RespondingService {
  id: string;
  name: string;
  type: 'ambulance' | 'police' | 'fire';
  status: ServiceStatus;
  etaMinutes: number;
  distanceKm: number;
  phone: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  notified: boolean;
  avatarIcon: 'user' | 'heart';
}

export interface SOSLocation {
  lat: number;
  lng: number;
  address: string;
  isLive: boolean;
}

export interface SOS {
  id: string;
  status: SOSStatus;
  whoNeedsHelp: WhoNeedsHelp;
  location: SOSLocation | null;
  respondingServices: RespondingService[];
  emergencyContacts: EmergencyContact[];
  triggeredAt: Date | null;
  etaMinutes: number | null;
  sessionId: string | null;
}
