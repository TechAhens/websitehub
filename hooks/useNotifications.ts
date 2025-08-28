import { useState, useEffect, useCallback } from 'react';
import { ApiNotification } from '@/types/website';
import { ApiService } from '@/utils/apiService';

// Mock notifications for demonstration
const MOCK_NOTIFICATIONS: ApiNotification[] = [
  {
    id: '1',
    title: 'Welcome to ITI App',
    message: 'Access all your ITI services from one convenient location.',
    type: 'info',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: '2',
    title: 'E Office Available',
    message: 'Digital workplace services are now accessible through the app.',
    type: 'success',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
  {
    id: '3',
    title: 'SARAL ESS Updated',
    message: 'HR services have been updated with new features.',
    type: 'info',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API, fallback to mock data
      const apiNotifications = await ApiService.fetchNotifications();
      setNotifications(apiNotifications.length > 0 ? apiNotifications : MOCK_NOTIFICATIONS);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      // Use mock data as fallback
      setNotifications(MOCK_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  }, [loadNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await ApiService.markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    refreshing,
    refreshNotifications,
    markAsRead,
  };
}