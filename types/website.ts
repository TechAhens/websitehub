export interface Website {
  id: string;
  name: string;
  url: string;
  icon: string;
  isFavorite: boolean;
  category?: string;
  dateAdded: string;
  lastVisited?: string;
  hasAutoLogin?: boolean;
}

export interface WebsiteFormData {
  name: string;
  url: string;
  category?: string;
}

export interface ApiNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface ApiWebsite {
  id: string;
  name: string;
  url: string;
  icon: string;
  category?: string;
  hasAutoLogin?: boolean;
}