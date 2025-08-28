import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Globe, 
  Trash2, 
  Download, 
  Upload, 
  Info, 
  ChevronRight 
} from 'lucide-react-native';
import { useWebsites } from '@/hooks/useWebsites';

export default function Settings() {
  const { websites, deleteWebsite } = useWebsites();
  const [loading, setLoading] = useState(false);

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all websites from your dashboard. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              for (const website of websites) {
                await deleteWebsite(website.id);
              }
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Export functionality will be available in a future update.');
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Import functionality will be available in a future update.');
  };

  const handleAbout = () => {
    Alert.alert(
      'About ITI App',
      'ITI App v1.0.0\n\nA centralized dashboard for accessing ITI services through embedded web views.\n\nBuilt for ITI employees to access all company services in one place.',
      [{ text: 'OK' }]
    );
  };

  const settingsItems = [
    {
      id: 'export',
      title: 'Export Data',
      description: 'Save your websites list',
      icon: Download,
      onPress: handleExportData,
      color: '#10b981',
    },
    {
      id: 'import',
      title: 'Import Data',
      description: 'Load websites from backup',
      icon: Upload,
      onPress: handleImportData,
      color: '#3b82f6',
    },
    {
      id: 'clear',
      title: 'Clear All Data',
      description: 'Remove all websites',
      icon: Trash2,
      onPress: handleClearAllData,
      color: '#ef4444',
    },
    {
      id: 'about',
      title: 'About',
      description: 'App information',
      icon: Info,
      onPress: handleAbout,
      color: '#6b7280',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Globe color="#3b82f6" size={24} />
            <Text style={styles.statNumber}>{websites.length}</Text>
            <Text style={styles.statLabel}>Total Websites</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {websites.filter(w => w.isFavorite).length}
            </Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {websites.filter(w => w.lastVisited).length}
            </Text>
            <Text style={styles.statLabel}>Visited</Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          {settingsItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.settingsItem}
                onPress={item.onPress}
                disabled={loading}
              >
                <View style={styles.settingsItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                    <IconComponent color={item.color} size={20} />
                  </View>
                  <View style={styles.settingsItemText}>
                    <Text style={styles.settingsItemTitle}>{item.title}</Text>
                    <Text style={styles.settingsItemDescription}>{item.description}</Text>
                  </View>
                </View>
                <ChevronRight color="#6b7280" size={20} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ITI App helps you access all ITI services in one convenient location.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  settingsSection: {
    marginHorizontal: 24,
    marginTop: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsItemText: {
    marginLeft: 16,
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingsItemDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  footer: {
    padding: 24,
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});