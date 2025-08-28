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
import { useTheme } from '@/contexts/ThemeContext';

export default function Favorites() {
  const { colors } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search favorites..."
      />

      {favoriteWebsites.length === 0 ? (
        <View style={styles.emptyState}>
          <Heart color="#ef4444" size={48} fill="#ef4444" />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {searchQuery ? 'No favorites found' : 'No favorites yet'}
          </Text>
          <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
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
    fontWeight: '600' as const,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});