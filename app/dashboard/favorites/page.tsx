"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, FileText, Video, Eye, Download, Trash2 } from "lucide-react";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { getFavorites, removeFavorite } from "@/utils/favorites";

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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const list = getFavorites();
    setFavorites(list);
    setLoading(false);
  }, []);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3DA7E3]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes favoris</h1>
        <p className="text-gray-500 mt-1">
          Retrouvez tous vos documents et vidéos favoris
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card className="border border-gray-200 text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun favori
          </h2>
          <p className="text-gray-500 mb-6">
            Ajoutez des documents ou vidéos à vos favoris pour les retrouver
            facilement.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard/documents">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" /> Parcourir les documents
              </Button>
            </Link>
            <Link href="/dashboard/videos">
              <Button variant="outline">
                <Video className="w-4 h-4 mr-2" /> Parcourir les vidéos
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((item) => (
            <Card
              key={item.id}
              className="border border-gray-200 hover:border-[#F49600] hover:shadow-md transition-all h-full"
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "#F4960010" }}
                  >
                    {item.type === "document" ? (
                      <FileText
                        className="w-5 h-5"
                        style={{ color: "#F49600" }}
                      />
                    ) : (
                      <Video className="w-5 h-5" style={{ color: "#F49600" }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={
                        item.type === "document"
                          ? `/dashboard/documents/${item.id}`
                          : `/dashboard/videos/${item.id}`
                      }
                      className="font-semibold text-gray-900 hover:text-[#3DA7E3] transition-colors line-clamp-1"
                    >
                      {item.title_fr}
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.type === "document" ? "Document" : "Vidéo"} •{" "}
                      {item.category || "-"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {item.description_fr || ""}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {item.view_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" /> {item.download_count || 0}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
