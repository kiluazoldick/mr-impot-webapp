interface FavoriteItem {
  id: string;
  type: "document" | "video";
  title_fr: string;
  description_fr?: string;
  category?: string;
  view_count?: number;
  download_count?: number;
  created_at: string;
}

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("favorites");
  return stored ? JSON.parse(stored) : [];
}

export function addToFavorites(item: FavoriteItem): void {
  const favorites = getFavorites();
  if (favorites.some((f) => f.id === item.id)) return;
  favorites.unshift(item);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((f) => f.id === id);
}
