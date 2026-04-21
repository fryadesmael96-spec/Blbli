export interface ContentItem {
  id: string;
  title: string;
  text: string;
  sourceUrls?: string[];
  imageUrl?: string;
  locationUrl?: string;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  cardClass: string;
  iconClass: string;
}