import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Globe, 
  Info, 
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react-native';
import { useWebsites } from '@/hooks/useWebsites';
import { useTheme } from '@/contexts/ThemeContext';

export default function Settings() {
  const { websites } = useWebsites();
  const { theme, toggleTheme, colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleAbout = () => {
    Alert.alert(
      'About ITI App',
      'ITI App v1.0.0\n\nA centralized dashboard for accessing ITI services through embedded web views.\n\nBuilt for ITI employees to access all company services in one place.',
      [{ text: 'OK' }]
    );
  };

  const settingsItems = [
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.statItem}>
            <Globe color={colors.primary} size={24} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{websites.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>ITI Services</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {websites.filter(w => w.isFavorite).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favorites</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {websites.filter(w => w.lastVisited).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Visited</Text>
          </View>
        </View>

        <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                {theme === 'light' ? (
                  <Sun color={colors.primary} size={20} />
                ) : (
                  <Moon color={colors.primary} size={20} />
                )}
              </View>
              <View style={styles.settingsItemText}>
                <Text style={[styles.settingsItemTitle, { color: colors.text }]}>
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </Text>
                <Text style={[styles.settingsItemDescription, { color: colors.textSecondary }]}>
                  Switch between light and dark themes
                </Text>
              </View>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={theme === 'dark' ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Information</Text>
          
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
                    <Text style={[styles.settingsItemTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.settingsItemDescription, { color: colors.textSecondary }]}>{item.description}</Text>
                  </View>
                </View>
                <ChevronRight color={colors.textSecondary} size={20} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
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
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 24,
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
    fontWeight: '700' as const,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  settingsSection: {
    marginHorizontal: 24,
    marginTop: 32,
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
    fontWeight: '600' as const,
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
    fontWeight: '500' as const,
  },
  settingsItemDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  footer: {
    padding: 24,
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});