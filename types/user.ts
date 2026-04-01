export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  phone?: string;
  address?: string;
  bio?: string;
  documentsCount: number;
  videosWatched: number;
  lastLogin: Date;
}
