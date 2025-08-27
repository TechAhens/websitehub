export interface Website {
  id: string;
  name: string;
  url: string;
  icon?: string;
  isFavorite: boolean;
  category?: string;
  dateAdded: string;
  lastVisited?: string;
}

export interface WebsiteFormData {
  name: string;
  url: string;
  category?: string;
}