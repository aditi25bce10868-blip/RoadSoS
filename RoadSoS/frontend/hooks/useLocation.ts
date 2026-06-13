import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { SOSLocation } from '../types/sos.types';
import { useSOSStore } from '../store/sosStore';

interface UseLocationReturn {
  location: SOSLocation | null;
  isTracking: boolean;
  error: string | null;
  startTracking: () => void;
  stopTracking: () => void;
}

export function useLocation(): UseLocationReturn {
  const setSOSLocation = useSOSStore(s => s.setLocation); // need this action in store
  const [location, setLocation] = useState<SOSLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const stopTracking = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    setIsTracking(false);
  }, []);

  const startTracking = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Location access denied. Please enable permissions.');
      return;
    }
    setIsTracking(true);
    setError(null);
    const current = await Location.getCurrentPositionAsync({});
    const loc = {
      lat: current.coords.latitude,
      lng: current.coords.longitude,
      address: '...',
      isLive: true,
    };
    setLocation(loc);
    setSOSLocation(loc);

    subscriptionRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: 'Downtown, Main Street, Los Angeles', // TODO: reverse geocode
          isLive: true,
        };
        setLocation(loc);
        setSOSLocation(loc); // <-- write into sosStore so useSoS.js can read sos.location
      }
    );
  }, [setSOSLocation]);

  useEffect(() => () => stopTracking(), [stopTracking]);

  return { location, isTracking, error, startTracking, stopTracking };
}
