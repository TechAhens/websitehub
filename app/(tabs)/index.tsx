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

export default function Dashboard() {
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
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading websites...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ITI App</Text>
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
            <Text style={styles.sectionTitle}>Recently Visited</Text>
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
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'ITI Services'}
          </Text>
          
          {filteredWebsites.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No services found' : 'Loading ITI services...'}
              </Text>
              <Text style={styles.emptyDescription}>
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
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
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
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
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
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
});