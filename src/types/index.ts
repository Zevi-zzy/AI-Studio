export interface ImageCard {
  id: string;
  image: string; // Base64 or URL
  description: string;
  orderIndex: number;
}

export interface Creation {
  id: string;
  title: string;
  content: string;
  coverImage?: string; // Base64 or URL
  hashtags: string[];
  imageCards: ImageCard[];
  tags: string[];
  inspirationId?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Inspiration {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  isAdopted: boolean;
  createdAt: Date;
}

export interface Material {
  id: string;
  type: 'image' | 'text';
  content: string; // Base64 for image, text content for text
  filename?: string;
  tags: string[];
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
  metadata?: {
    size?: number;
    dimensions?: { width: number; height: number };
    wordCount?: number;
  };
}

export interface Profile {
  id: string;
  avatar?: string;
  nickname: string;
  bio?: string;
  location?: string;
  accountType: string;
  totalCreations: number;
  createdAt: Date;
  settings?: {
    defaultTone: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    aiPreferences: Record<string, any>;
    theme: 'light' | 'dark';
  };
}

// AI Service Types
export interface GenerateInspirationRequest {
  keywords: string[];
  count?: number;
  language?: 'zh' | 'en';
}

export interface GenerateContentRequest {
  type: 'title' | 'description' | 'hashtags';
  context: {
    inspiration?: string;
    keywords?: string[];
    tone?: 'casual' | 'professional' | 'trendy';
  };
}

export interface GenerateImageRequest {
  prompt: string;
  size?: '1024x1024' | '512x512';
  style?: 'realistic' | 'cartoon' | 'minimal';
}
