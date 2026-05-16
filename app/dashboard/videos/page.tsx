"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  Video,
  Search,
  Filter,
  X,
  Play,
  Eye,
  Heart,
  Loader2,
} from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import { publicApi } from "@/services/api";

interface VidItem {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr?: string;
  description_en?: string;
  category?: { id: string; name_fr: string; name_en: string };
  file_path?: string;
  created_at: string;
  view_count?: number;
  duration?: number;
}

interface CatItem {
  id: string;
  name_fr: string;
  name_en: string;
  parent_id: string | null;
}

function VideosContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [videos, setVideos] = useState<VidItem[]>([]);
  const [categories, setCategories] = useState<CatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsRes, vidsRes] = await Promise.all([
          publicApi.getCategories(),
          publicApi.getVideos({ page: "1", limit: "20" }),
        ]);
        const catsList = Array.isArray(catsRes) ? catsRes : catsRes?.data || [];
        setCategories(catsList.filter((c: CatItem) => !c.parent_id));
        setVideos(vidsRes?.data || []);
      } catch (error) {
        console.error("Erreur chargement vidéos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      searchQuery === "" ||
      (video.title_fr || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (video.description_fr || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      video.category?.name_fr === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vidéos éducatives</h1>
        <p className="text-gray-500 mt-1">
          Apprenez à votre rythme avec nos experts fiscaux
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une vidéo..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#3DA7E3] focus:ring-1 focus:ring-[#3DA7E3] transition-all"
            />
          </div>
        </div>

        <div className="hidden sm:flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Filter className="w-4 h-4" /> Catégories :
          </span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === "all" ? "bg-[#3DA7E3] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name_fr)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.name_fr ? "bg-[#3DA7E3] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {cat.name_fr}
            </button>
          ))}
          {(selectedCategory !== "all" || searchQuery !== "") && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#F49600] hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Effacer
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          {filteredVideos.length} vidéo(s) trouvée(s)
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <Card className="border border-gray-200 text-center py-12">
            <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Aucune vidéo trouvée
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-4"
            >
              Voir toutes les vidéos
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVideos.map((video) => (
              <Link
                key={video.id}
                href={`/dashboard/videos/${video.id}`}
                className="group"
              >
                <Card className="border border-gray-200 hover:border-[#3DA7E3] hover:shadow-lg transition-all overflow-hidden p-0 h-full flex flex-col">
                  <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
                    <Play className="w-12 h-12 text-white bg-black/40 rounded-full p-3 group-hover:bg-[#3DA7E3] transition-colors" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#3DA7E3] transition-colors line-clamp-2">
                      {video.title_fr}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-1">
                      {video.description_fr || ""}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <Badge variant="default" size="sm">
                        {video.category?.name_fr || "Vidéo"}
                      </Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {video.view_count || 0} vues
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#3DA7E3]" />
        </div>
      }
    >
      <VideosContent />
    </Suspense>
  );
}
