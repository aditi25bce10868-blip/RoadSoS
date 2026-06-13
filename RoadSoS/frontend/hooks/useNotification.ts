// frontend/hooks/useNotification.ts
import { useState, useCallback } from 'react';
import { BannerData } from '../components/ui/NotificationBanner';
import { useNotificationStore } from '../store/notificationStore';

const NOTIFICATION_CONFIGS: Record<string, Omit<BannerData, 'type'>> = {
  sos_activated: {
    icon:    '🚨',
    title:   'Emergency Alert Sent',
    message: 'Emergency contacts and nearby services have been notified.',
    color:   '#e53935',
  },
  sos_resolved: {
    icon:    '✅',
    title:   'Emergency Resolved',
    message: 'Your emergency session has been successfully closed.',
    color:   '#4caf50',
  },
  detection_enabled: {
    icon:    '🛡️',
    title:   'Auto Detection Active',
    message: 'RoadSOS is monitoring for potential accidents.',
    color:   '#4caf50',
  },
  detection_disabled: {
    icon:    'ℹ️',
    title:   'Auto Detection Disabled',
    message: 'You can enable it anytime from Settings.',
    color:   '#888',
  },
  tracking_started: {
    icon:    '📍',
    title:   'Live Tracking Started',
    message: 'Your location is now being shared with emergency contacts.',
    color:   '#1565c0',
  },
  tracking_ended: {
    icon:    '📍',
    title:   'Live Tracking Ended',
    message: 'Location sharing has been stopped.',
    color:   '#888',
  },
  bystander_submitted: {
    icon:    '🚨',
    title:   'Incident Report Submitted',
    message: 'Nearby emergency services have been notified.',
    color:   '#e53935',
  },
};



export const useNotification = () => {
  const pendingType = useNotificationStore(s => s.pendingType);
  const clearNotification = useNotificationStore(s => s.clearNotification);

  const banner: BannerData | null = pendingType
    ? { type: pendingType, ...NOTIFICATION_CONFIGS[pendingType] }
    : null;

  const hide = () => clearNotification();

  return { banner, hide };
};
