import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Heart, Globe, MoveVertical as MoreVertical } from 'lucide-react-native';
import { Website } from '@/types/website';

interface WebsiteCardProps {
  website: Website;
  onToggleFavorite: (id: string) => void;
  onEdit: (website: Website) => void;
  onDelete: (id: string) => void;
  onVisit: (id: string) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function WebsiteCard({ 
  website, 
  onToggleFavorite, 
  onEdit, 
  onDelete, 
  onVisit 
}: WebsiteCardProps) {
  const handlePress = () => {
    onVisit(website.id);
    router.push({
      pathname: '/webview',
      params: { 
        url: website.url, 
        title: website.name,
        websiteId: website.id 
      }
    });
  };

  const handleLongPress = () => {
    // Could implement context menu here
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(website.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Heart
            color={website.isFavorite ? '#ef4444' : '#6b7280'}
            size={20}
            fill={website.isFavorite ? '#ef4444' : 'none'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.moreButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreVertical color="#6b7280" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.iconContainer}>
        {website.icon ? (
          <Image source={{ uri: website.icon }} style={styles.websiteIcon} />
        ) : (
          <View style={styles.defaultIcon}>
            <Globe color="#3b82f6" size={32} />
          </View>
        )}
      </View>

      <Text style={styles.websiteName} numberOfLines={2}>
        {website.name}
      </Text>
      
      <Text style={styles.websiteUrl} numberOfLines={1}>
        {website.url.replace(/^https?:\/\//, '')}
      </Text>

      {website.category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{website.category}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  favoriteButton: {
    padding: 4,
  },
  moreButton: {
    padding: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  websiteIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  defaultIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  websiteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 20,
  },
  websiteUrl: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
  },
  categoryText: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: '500',
  },
});