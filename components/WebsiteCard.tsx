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
import { Heart, MoreVertical } from 'lucide-react-native';
import { Website } from '@/types/website';
import { useTheme } from '@/contexts/ThemeContext';

const localIcons: Record<string, any> = {
  eoffice: require('../assets/images/eoffice.jpg'),
  cams: require('../assets/images/cams.jpg'),
  website: require('../assets/images/website.jpg'), // default fallback
};


// ✅ Helper to safely get a favicon or fallback
const getWebsiteIcon = (website: Website) => {
  // 1️⃣ Use HTTP icon if provided
  if (website.icon && website.icon.startsWith('http')) {
    return { uri: website.icon };
  }

  // 2️⃣ Special local images
  const key = website.name.toLowerCase().replace(/\s+/g, '');
  if (localIcons[key]) {
    return localIcons[key];
  }

  // 3️⃣ Try Google favicon as fallback
  try {
    const urlObj = new URL(website.url);
    return { uri: `https://www.google.com/s2/favicons?sz=64&domain=${urlObj.hostname}` };
  } catch {
    // 4️⃣ Default fallback image
    return localIcons.website;
  }
};

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
  onVisit,
}: WebsiteCardProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    onVisit(website.id);
    router.push({
      pathname: '/webview',
      params: {
        url: website.url,
        title: website.name,
        websiteId: website.id,
      },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Header */}
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
          <MoreVertical color={colors.textSecondary} size={20} />
        </TouchableOpacity>
      </View>

      {/* Icon */}
      <View style={styles.iconContainer}>
        <Image
          source={getWebsiteIcon(website)}
          style={styles.websiteIcon}
        />
      </View>

      {/* Name */}
      <Text
        style={[styles.websiteName, { color: colors.text }]}
        numberOfLines={2}
      >
        {website.name}
      </Text>

      {/* URL */}
      <Text
        style={[styles.websiteUrl, { color: colors.textSecondary }]}
        numberOfLines={1}
      >
        {website.url.replace(/^https?:\/\//, '')}
      </Text>

      {/* Category Badge */}
      {website.category && (
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: `${colors.primary}15` },
          ]}
        >
          <Text style={[styles.categoryText, { color: colors.primary }]}>
            {website.category}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  favoriteButton: { padding: 4 },
  moreButton: { padding: 4 },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  websiteIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  websiteName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 20,
  },
  websiteUrl: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
