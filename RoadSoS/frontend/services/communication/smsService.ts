// frontend/services/communication/smsService.ts
import { API_BASE_URL } from '../../constants/api';

interface Contact {
  name: string;
  phone: string; // E.164 format: +91XXXXXXXXXX
}

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export const triggerSOSSms = async (
  contacts: Contact[],
  location: Location,
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/api/sos/trigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ emergencyContacts: contacts, location }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const message =
      typeof errorData === 'object' && errorData !== null && 'message' in errorData
        ? String((errorData as { message?: unknown }).message ?? 'Failed to send SOS')
        : 'Failed to send SOS';
    throw new Error(message);
  }

  return response.json();
};
