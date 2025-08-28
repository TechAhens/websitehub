import * as SecureStore from 'expo-secure-store';

interface LoginCredentials {
  username: string;
  password: string;
}

export const AuthStorage = {
  async saveCredentials(websiteId: string, credentials: LoginCredentials): Promise<void> {
    try {
      const key = `auth_${websiteId}`;
      await SecureStore.setItemAsync(key, JSON.stringify(credentials));
    } catch (error) {
      console.error('Failed to save credentials:', error);
    }
  },

  async getCredentials(websiteId: string): Promise<LoginCredentials | null> {
    try {
      const key = `auth_${websiteId}`;
      const stored = await SecureStore.getItemAsync(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get credentials:', error);
      return null;
    }
  },

  async removeCredentials(websiteId: string): Promise<void> {
    try {
      const key = `auth_${websiteId}`;
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Failed to remove credentials:', error);
    }
  },

  async hasCredentials(websiteId: string): Promise<boolean> {
    try {
      const credentials = await this.getCredentials(websiteId);
      return credentials !== null;
    } catch (error) {
      return false;
    }
  }
};