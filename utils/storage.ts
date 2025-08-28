import AsyncStorage from '@react-native-async-storage/async-storage';
import { Website } from '@/types/website';
import { PREDEFINED_WEBSITES } from './predefinedWebsites';
import { ApiService } from './apiService';

const WEBSITES_KEY = 'websites';
const INITIALIZED_KEY = 'app_initialized';

export const StorageUtils = {
  async getWebsites(): Promise<Website[]> {
    try {
      // Check if app has been initialized with predefined websites
      const initialized = await AsyncStorage.getItem(INITIALIZED_KEY);
      if (!initialized) {
        await this.initializeWithPredefinedWebsites();
      }
      
      // Try to fetch updated websites from API
      try {
        const apiWebsites = await ApiService.fetchWebsites();
        if (apiWebsites.length > 0) {
          // Merge API websites with local data
          const localWebsites = await this.getLocalWebsites();
          const mergedWebsites = this.mergeWebsites(localWebsites, apiWebsites);
          await this.saveWebsites(mergedWebsites);
          return mergedWebsites;
        }
      } catch (error) {
        console.log('API not available, using local data');
      }
      
      return await this.getLocalWebsites();
    } catch (error) {
      console.error('Error loading websites:', error);
      return [];
    }
  },

  async getLocalWebsites(): Promise<Website[]> {
    try {
      const stored = await AsyncStorage.getItem(WEBSITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading local websites:', error);
      return [];
    }
  },

  mergeWebsites(localWebsites: Website[], apiWebsites: any[]): Website[] {
    const merged = [...localWebsites];
    
    apiWebsites.forEach(apiWebsite => {
      const existingIndex = merged.findIndex(w => w.id === apiWebsite.id);
      if (existingIndex >= 0) {
        // Update existing website with API data
        merged[existingIndex] = {
          ...merged[existingIndex],
          name: apiWebsite.name,
          url: apiWebsite.url,
          icon: apiWebsite.icon,
          category: apiWebsite.category,
          hasAutoLogin: apiWebsite.hasAutoLogin,
        };
      } else {
        // Add new website from API
        merged.push({
          id: apiWebsite.id,
          name: apiWebsite.name,
          url: this.formatUrl(apiWebsite.url),
          icon: apiWebsite.icon,
          isFavorite: false,
          category: apiWebsite.category,
          dateAdded: new Date().toISOString(),
          hasAutoLogin: apiWebsite.hasAutoLogin,
        });
      }
    });
    
    return merged;
  },
  async initializeWithPredefinedWebsites(): Promise<void> {
    try {
      await AsyncStorage.setItem(WEBSITES_KEY, JSON.stringify(PREDEFINED_WEBSITES));
      await AsyncStorage.setItem(INITIALIZED_KEY, 'true');
    } catch (error) {
      console.error('Error initializing predefined websites:', error);
    }
  },

  async saveWebsites(websites: Website[]): Promise<void> {
    try {
      await AsyncStorage.setItem(WEBSITES_KEY, JSON.stringify(websites));
    } catch (error) {
      console.error('Error saving websites:', error);
      throw error;
    }
  },

  async addWebsite(websiteData: { name: string; url: string; category?: string }): Promise<Website> {
    const websites = await this.getWebsites();
    const newWebsite: Website = {
      id: Date.now().toString(),
      name: websiteData.name,
      url: this.formatUrl(websiteData.url),
      isFavorite: false,
      category: websiteData.category,
      dateAdded: new Date().toISOString(),
    };
    
    websites.push(newWebsite);
    await this.saveWebsites(websites);
    return newWebsite;
  },

  async updateWebsite(id: string, updates: Partial<Website>): Promise<void> {
    const websites = await this.getWebsites();
    const index = websites.findIndex(w => w.id === id);
    if (index >= 0) {
      websites[index] = { ...websites[index], ...updates };
      await this.saveWebsites(websites);
    }
  },

  async deleteWebsite(id: string): Promise<void> {
    const websites = await this.getWebsites();
    const filtered = websites.filter(w => w.id !== id);
    await this.saveWebsites(filtered);
  },

  async toggleFavorite(id: string): Promise<void> {
    const websites = await this.getWebsites();
    const website = websites.find(w => w.id === id);
    if (website) {
      website.isFavorite = !website.isFavorite;
      await this.saveWebsites(websites);
    }
  },

  formatUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  },

  isValidUrl(url: string): boolean {
    try {
      const formatted = this.formatUrl(url);
      new URL(formatted);
      return true;
    } catch {
      return false;
    }
  }
};