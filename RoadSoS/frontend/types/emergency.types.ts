// frontend/types/emergency.types.ts

export interface Location {
  lat:          number;
  lng:          number;
  address?:     string;
  isOffline?:   boolean;   // true when phone has no internet
  lastOnlineAt?: string;   // ISO string of last time location was updated online
}

export interface EmergencyContact {
  name:       string;
  phone:      string;      // E.164 format: +91XXXXXXXXXX
  type?:      ContactType; // personal | hospital | police | ambulance | toll | road_rescue | highway_patrol
  callOrder?: number;      // priority order for calls (0 = highest)
}

export type ContactType =
  | 'personal'
  | 'hospital'
  | 'police'
  | 'ambulance'
  | 'toll'
  | 'road_rescue'
  | 'highway_patrol';

export type EmergencyStatus = 'idle' | 'active' | 'resolved' | 'cancelled';

export type CountryCode = 'IN' | 'BD' | 'MM';

export type EmergencyType = 'police' | 'ambulance' | 'fire' | 'roadside' | 'unified';

export interface SOSEvent {
  id:          string;
  userId:      string;
  location:    Location;
  contacts:    EmergencyContact[];
  status:      EmergencyStatus;
  triggeredAt: string;
  resolvedAt?: string;
  countryCode: CountryCode;
}

export interface SMSResult {
  contact: EmergencyContact;
  status:  'fulfilled' | 'rejected';
  sid:     string | null;
  error:   string | null;
}
// CallResult — no more callSid, use phone instead
export interface CallResult {
  contact: EmergencyContact;
  status:  'fulfilled' | 'rejected' | 'pending'; // pending = native dialer opened
  phone:   string;
  error:   string | null;
}
// SOSSummary — calls are native now, no callsMade count
export interface SOSSummary {
  smsSentTo:   number;
  smsSent:     number;
  smsFailed:   number;
  calledIn:    string[];  // names of contacts called
}

export interface SOSResponse {
  success:     boolean;
  userName:    string;
  location:    Location;
  smsResults:  SMSResult[];
  callResults: CallResult[];
  summary:     SOSSummary;
}

export interface EmergencyNumber {
  countryName: string;
  callingCode: string;
  police:      string;
  ambulance:   string;
  fire:        string;
  roadside:    string;
  unified:     string;
  smsCapable:  boolean;
  notes:       string;
}

export type EmergencyNumberMap = Record<CountryCode, EmergencyNumber>;

export const getEmergencyNumber = (
  map: EmergencyNumberMap,
  countryCode: CountryCode,
  type: EmergencyType = 'unified'
): string => {
  return map[countryCode][type] || map[countryCode].unified;
};
