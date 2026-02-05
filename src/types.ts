
export interface ColorOption {
  name: string;
  hex: string;
  image: string;
}

export interface Wallpaper {
  id: string;
  name: string;
  collection: string;
  price: string;
  description: string;
  image: string; // Primary Hero
  roomPreview: string; // For visualizer
  texture: string; // For tiling
  gallery: string[]; // Set of 5+ editorial images
  category: 'Modern' | 'Classic' | 'Textured' | 'Nature';
  colors?: ColorOption[];
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}
