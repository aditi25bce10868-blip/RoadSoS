// frontend/store/notificationStore.ts
import { create } from 'zustand';

interface NotificationStore {
  pendingType: string | null;
  showNotification: (type: string) => void;
  clearNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  pendingType: null,
  showNotification: (type) => set({ pendingType: type }),
  clearNotification: () => set({ pendingType: null }),
}));

// Standalone trigger — call from anywhere without hooks
export const triggerNotification = (type: string) => {
  useNotificationStore.getState().showNotification(type);
};
