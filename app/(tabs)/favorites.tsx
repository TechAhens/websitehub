import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { useWebsites } from '@/hooks/useWebsites';
import WebsiteCard from '@/components/WebsiteCard';
import SearchBar from '@/components/SearchBar';

export default function Favorites() {
  const {
    websites,
    refreshing,
    refreshWebsites,
    updateWebsite,
    deleteWebsite,
    toggleFavorite,
    markVisited,
  } = useWebsites();

  const [searchQuery, setSearchQuery] = useState('');

  const favoriteWebsites = useMemo(() => {
    const favorites = websites.filter(website => website.isFavorite);
    
    if (!searchQuery.trim()) return favorites;
    
    const query = searchQuery.toLowerCase();
    return favorites.filter(website =>
      website.name.toLowerCase().includes(query) ||
      website.url.toLowerCase().includes(query) ||
      website.category?.toLowerCase().includes(query)
    );
  }, [websites, searchQuery]);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search favorites..."
      />

      {favoriteWebsites.length === 0 ? (
        <View style={styles.emptyState}>
          <Heart color="#ef4444" size={48} fill="#ef4444" />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No favorites found' : 'No favorites yet'}
          </Text>
          <Text style={styles.emptyDescription}>
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Tap the heart icon on any website to add it to favorites'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteWebsites}
          renderItem={renderWebsiteCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshWebsites} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
  row: {
    justifyContent: 'space-between',
  },
  listContainer: {
    padding: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});