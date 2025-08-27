import { useState, useEffect, useCallback } from 'react';
import { Website } from '@/types/website';
import { StorageUtils } from '@/utils/storage';

export function useWebsites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWebsites = useCallback(async () => {
    try {
      setLoading(true);
      const loadedWebsites = await StorageUtils.getWebsites();
      setWebsites(loadedWebsites);
    } catch (error) {
      console.error('Failed to load websites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshWebsites = useCallback(async () => {
    setRefreshing(true);
    await loadWebsites();
    setRefreshing(false);
  }, [loadWebsites]);

  const addWebsite = useCallback(async (websiteData: { name: string; url: string; category?: string }) => {
    try {
      const newWebsite = await StorageUtils.addWebsite(websiteData);
      setWebsites(prev => [...prev, newWebsite]);
      return newWebsite;
    } catch (error) {
      console.error('Failed to add website:', error);
      throw error;
    }
  }, []);

  const updateWebsite = useCallback(async (id: string, updates: Partial<Website>) => {
    try {
      await StorageUtils.updateWebsite(id, updates);
      setWebsites(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
    } catch (error) {
      console.error('Failed to update website:', error);
      throw error;
    }
  }, []);

  const deleteWebsite = useCallback(async (id: string) => {
    try {
      await StorageUtils.deleteWebsite(id);
      setWebsites(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      console.error('Failed to delete website:', error);
      throw error;
    }
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    try {
      await StorageUtils.toggleFavorite(id);
      setWebsites(prev => prev.map(w => 
        w.id === id ? { ...w, isFavorite: !w.isFavorite } : w
      ));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  }, []);

  const markVisited = useCallback(async (id: string) => {
    try {
      await StorageUtils.updateWebsite(id, { lastVisited: new Date().toISOString() });
      setWebsites(prev => prev.map(w => 
        w.id === id ? { ...w, lastVisited: new Date().toISOString() } : w
      ));
    } catch (error) {
      console.error('Failed to mark visited:', error);
    }
  }, []);

  useEffect(() => {
    loadWebsites();
  }, [loadWebsites]);

  return {
    websites,
    loading,
    refreshing,
    refreshWebsites,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    toggleFavorite,
    markVisited,
  };
}