import { ApiWebsite, ApiNotification } from '@/types/website';

// Mock API configuration - replace with your actual API endpoints
const API_BASE_URL = 'https://api.itiltd.in'; // Replace with actual API URL
const API_KEY = 'your-api-key'; // Replace with actual API key

export const ApiService = {
  async fetchWebsites(): Promise<ApiWebsite[]> {
    try {
      // Mock implementation - replace with actual API call
      const response = await fetch(`${API_BASE_URL}/websites`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch websites');
      }
      
      const data = await response.json();
      return data.websites || [];
    } catch (error) {
      console.error('API Error fetching websites:', error);
      // Return empty array on error - app will use predefined websites
      return [];
    }
  },

  async fetchNotifications(): Promise<ApiNotification[]> {
    try {
      // Mock implementation - replace with actual API call
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      return data.notifications || [];
    } catch (error) {
      console.error('API Error fetching notifications:', error);
      // Return empty array on error
      return [];
    }
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('API Error marking notification as read:', error);
    }
  }
};

// Configuration for API endpoints
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    WEBSITES: '/websites',
    NOTIFICATIONS: '/notifications',
    MARK_READ: '/notifications/:id/read',
  },
  // Update these with your actual API configuration
  HEADERS: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  }
};