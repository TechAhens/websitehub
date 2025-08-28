// ApiService.ts
import { ApiWebsite, ApiNotification } from '@/types/website';

const API_BASE_URL = "https://eoffice.itiltd.in/api"; // Replace with your server path

export const ApiService = {
  async fetchWebsites(): Promise<ApiWebsite[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/get_websites.php`);
      const data = await response.json();
      return data.websites || [];
    } catch (error) {
      console.error("API Error fetching websites:", error);
      return [];
    }
  },

  async fetchNotifications(): Promise<ApiNotification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/get_notifications.php`);
      const data = await response.json();
      return data.notifications || [];
    } catch (error) {
      console.error("API Error fetching notifications:", error);
      return [];
    }
  },

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/mark_notification_read.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${id}`,
      });
    } catch (error) {
      console.error("API Error marking notification as read:", error);
    }
  }
};
