export type ServiceStatus = 'available' | 'busy' | 'closed';

export type ServiceCategory =
  | 'hospital'
  | 'police'
  | 'ambulance'
  | 'tow'
  | 'repair'
  | 'pharmacy'
  | 'gas'
  | 'clinic'
  | 'trauma';

export interface NearbyService {
  id: string;
  name: string;
  category: ServiceCategory;
  subcategory?: string;
  address: string;
  distanceKm: number;
  etaMin: number;
  status: ServiceStatus;
  phone: string;
  isVerified?: boolean;
}

export type FilterTab = 'hospitals' | 'police' | 'ambulance';
