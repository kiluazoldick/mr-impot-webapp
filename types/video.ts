export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  category: string;
  views: number;
  uploadedAt: Date;
  isFavorite?: boolean;
}

export interface VideoCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}
