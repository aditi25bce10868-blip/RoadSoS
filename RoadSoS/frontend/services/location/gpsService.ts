// frontend/services/location/gpsService.ts
import * as Location from 'expo-location';
import * as Battery  from 'expo-battery';
import * as Network  from 'expo-network';

export interface LocationData {
  lat:       number;
  lng:       number;
  address?:  string;
  accuracy?: number;
  speed?:    number;
  timestamp: number;
}

export interface DeviceState {
  battery:  number | null;
  network:  string;
  isOnline: boolean;
}

/**
 * Request location permissions
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

/**
 * Get current location
 */
export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    // Reverse geocode for address
    let address = '';
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude:  location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (geocode[0]) {
        const g = geocode[0];
        address = [g.name, g.street, g.district, g.city]
          .filter(Boolean).join(', ');
      }
    } catch { /* address not critical */ }

    return {
      lat:       location.coords.latitude,
      lng:       location.coords.longitude,
      accuracy:  location.coords.accuracy || undefined,
      speed:     location.coords.speed    || undefined,
      address,
      timestamp: Date.now(),
    };
  } catch (err) {
    console.error('GPS error:', err);
    return null;
  }
};

/**
 * Get device state — battery + network
 */
export const getDeviceState = async (): Promise<DeviceState> => {
  let battery: number | null = null;
  let network = 'unknown';
  let isOnline = false;

  try {
    const level = await Battery.getBatteryLevelAsync();
    battery = Math.round(level * 100);
  } catch { /* battery not critical */ }

  try {
    const state = await Network.getNetworkStateAsync();
    isOnline = !!(state.isConnected && state.isInternetReachable);
    network  = isOnline ? (state.type || 'online') : 'offline';
  } catch { /* network not critical */ }

  return { battery, network, isOnline };
};
