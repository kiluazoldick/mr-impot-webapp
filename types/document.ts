export interface Document {
  id: string;
  title: string;
  description: string;
  category: Category;
  subCategory?: string;
  format: "PDF" | "DOC" | "DOCX" | "TXT";
  url: string;
  thumbnail?: string;
  uploadedBy: string;
  uploadedAt: Date;
  downloads: number;
  views: number;
  isFavorite?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}
