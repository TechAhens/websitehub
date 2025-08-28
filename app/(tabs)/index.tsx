import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWebsites } from '@/hooks/useWebsites';
import WebsiteCard from '@/components/WebsiteCard';
import SearchBar from '@/components/SearchBar';
import { useTheme } from '@/contexts/ThemeContext';

export default function Dashboard() {
  const { colors } = useTheme();
  const {
    websites,
    loading,
    refreshing,
    refreshWebsites,
    updateWebsite,
    deleteWebsite,
    toggleFavorite,
    markVisited,
  } = useWebsites();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredWebsites = useMemo(() => {
    if (!searchQuery.trim()) return websites;
    
    const query = searchQuery.toLowerCase();
    return websites.filter(website =>
      website.name.toLowerCase().includes(query) ||
      website.url.toLowerCase().includes(query) ||
      website.category?.toLowerCase().includes(query)
    );
  }, [websites, searchQuery]);

  const recentWebsites = useMemo(() => {
    return websites
      .filter(w => w.lastVisited)
      .sort((a, b) => new Date(b.lastVisited!).getTime() - new Date(a.lastVisited!).getTime())
      .slice(0, 4);
  }, [websites]);

  const handleEditWebsite = (website: any) => {
    // Could implement edit functionality here
  };

  const renderWebsiteCard = ({ item }: { item: any }) => (
    <WebsiteCard
      website={item}
      onToggleFavorite={toggleFavorite}
      onEdit={handleEditWebsite}
      onDelete={deleteWebsite}
      onVisit={markVisited}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading ITI services...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>ITI App</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshWebsites} />
        }
        showsVerticalScrollIndicator={false}
      >
        {recentWebsites.length > 0 && !searchQuery && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recently Visited</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentList}
            >
              {recentWebsites.map((website) => (
                <View key={website.id} style={styles.recentItem}>
                  <WebsiteCard
                    website={website}
                    onToggleFavorite={toggleFavorite}
                    onEdit={handleEditWebsite}
                    onDelete={deleteWebsite}
                    onVisit={markVisited}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {searchQuery ? 'Search Results' : 'ITI Services'}
          </Text>
          
          {filteredWebsites.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {searchQuery ? 'No services found' : 'Loading ITI services...'}
              </Text>
              <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Please wait while we load your ITI services'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredWebsites}
              renderItem={renderWebsiteCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContainer}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
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
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 16,
  },
  recentList: {
    paddingRight: 24,
  },
  recentItem: {
    marginRight: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  gridContainer: {
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
});