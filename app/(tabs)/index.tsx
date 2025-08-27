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
import { Plus } from 'lucide-react-native';
import { useWebsites } from '@/hooks/useWebsites';
import WebsiteCard from '@/components/WebsiteCard';
import AddWebsiteModal from '@/components/AddWebsiteModal';
import SearchBar from '@/components/SearchBar';

export default function Dashboard() {
  const {
    websites,
    loading,
    refreshing,
    refreshWebsites,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    toggleFavorite,
    markVisited,
  } = useWebsites();

  const [showAddModal, setShowAddModal] = useState(false);
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
        <Text style={styles.title}>Website Hub</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
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
            {searchQuery ? 'Search Results' : 'All Websites'}
          </Text>
          
          {filteredWebsites.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No websites found' : 'No websites added yet'}
              </Text>
              <Text style={styles.emptyDescription}>
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Add your first website to get started'
                }
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => setShowAddModal(true)}
                >
                  <Plus color="#3b82f6" size={20} />
                  <Text style={styles.emptyButtonText}>Add Website</Text>
                </TouchableOpacity>
              )}
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

      <AddWebsiteModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addWebsite}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#3b82f6',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
});