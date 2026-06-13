import apiClient from './axiosInstance';
import { SOSResponse } from '../../types/emergency.types';

interface TriggerSOSPayload {
  location: { lat: number; lng: number; address?: string };
  emergencyContacts: { name: string; phone: string }[];
}

export const sosApi = {
  trigger: async (payload: TriggerSOSPayload): Promise<SOSResponse> => {
    return apiClient.post<SOSResponse>('/sos/trigger', payload);
  },
};
