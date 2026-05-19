"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Video,
  Heart,
  ChevronRight,
  Play,
  Eye,
  Download,
} from "lucide-react";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import { publicApi, authApi } from "@/services/api";

interface DocItem {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr?: string;
  description_en?: string;
  category?: { id: string; name_fr: string; name_en: string };
  file_path?: string;
  created_at: string;
  view_count?: number;
  download_count?: number;
}

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
  slug: string;
  parent_id: string | null;
  subcategories?: CatItem[];
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [categories, setCategories] = useState<CatItem[]>([]);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [videos, setVideos] = useState<VidItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le profil utilisateur pour avoir le vrai nom
        let name = "";
        try {
          const me = await authApi.me();
          if (me?.profile) {
            name =
              [me.profile.first_name, me.profile.last_name]
                .filter(Boolean)
                .join(" ") ||
              me.profile.email?.split("@")[0] ||
              "Utilisateur";
          }
        } catch {
          // Fallback localStorage
          const storedName = localStorage.getItem("user-name");
          const email = localStorage.getItem("user-email") || "";
          name = storedName || email.split("@")[0] || "Utilisateur";
        }
        setUserName(name);

        // Récupérer catégories, documents, vidéos
        const [catsRes, docsRes, vidsRes] = await Promise.all([
          publicApi.getCategories(),
          publicApi.getDocuments({ page: "1", limit: "6" }),
          publicApi.getVideos({ page: "1", limit: "3" }),
        ]);

        const catsList = Array.isArray(catsRes)
          ? catsRes
          : (catsRes as any)?.data || [];
        const mainCats = catsList.filter((c: CatItem) => !c.parent_id);
        const subCats = catsList.filter((c: CatItem) => c.parent_id);
        const catsWithSubs = mainCats.map((cat: CatItem) => ({
          ...cat,
          subcategories: subCats.filter(
            (sub: CatItem) => sub.parent_id === cat.id,
          ),
        }));
        setCategories(catsWithSubs);

        setDocuments((docsRes as any)?.data || []);
        setVideos((vidsRes as any)?.data || []);
      } catch (error) {
        console.error("Erreur chargement dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {userName}
        </h1>
        <p className="text-gray-500 mt-1">
          Découvrez les dernières ressources juridiques
        </p>
      </div>

      {/* Catégories principales */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Catégories</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category, idx) => (
              <Link
                key={category.id}
                href={`/dashboard/documents?category=${category.slug}`}
                className="group"
              >
                <Card className="border border-gray-200 hover:border-[#3DA7E3] hover:shadow-md transition-all cursor-pointer">
                  <div className="text-center p-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
                      style={{
                        backgroundColor:
                          idx % 2 === 0 ? "#3DA7E310" : "#F4960010",
                      }}
                    >
                      <FileText
                        className="w-6 h-6"
                        style={{ color: idx % 2 === 0 ? "#3DA7E3" : "#F49600" }}
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-[#3DA7E3] transition-colors">
                      {category.name_fr}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {category.subcategories?.length || 0} sous-catégories
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Documents récents */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Documents récents
          </h2>
          <Link
            href="/dashboard/documents"
            className="text-sm text-[#3DA7E3] hover:underline flex items-center gap-1"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <Card className="border border-gray-200 text-center py-8">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Aucun document pour le moment</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.slice(0, 3).map((doc) => (
              <Link
                key={doc.id}
                href={`/dashboard/documents/${doc.id}`}
                className="group"
              >
                <Card className="border border-gray-200 hover:border-[#3DA7E3] hover:shadow-md transition-all h-full">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "#3DA7E310" }}
                      >
                        <FileText
                          className="w-5 h-5"
                          style={{ color: "#3DA7E3" }}
                        />
                      </div>
                      <Badge variant="default" size="sm">
                        PDF
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {doc.title_fr}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {doc.description_fr || ""}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {doc.view_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />{" "}
                        {doc.download_count || 0}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Vidéos récentes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Vidéos recommandées
          </h2>
          <Link
            href="/dashboard/videos"
            className="text-sm text-[#3DA7E3] hover:underline flex items-center gap-1"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        ) : videos.length === 0 ? (
          <Card className="border border-gray-200 text-center py-8">
            <Video className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Aucune vidéo pour le moment</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.slice(0, 3).map((video) => (
              <Link
                key={video.id}
                href={`/dashboard/videos/${video.id}`}
                className="group"
              >
                <Card className="border border-gray-200 hover:border-[#3DA7E3] hover:shadow-md transition-all overflow-hidden">
                  <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white bg-black/40 rounded-full p-3" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {video.title_fr}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {video.description_fr || ""}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="default" size="sm">
                        {video.category?.name_fr || "Vidéo"}
                      </Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {video.view_count || 0}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Favoris */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Mes favoris</h2>
          <Link
            href="/dashboard/favorites"
            className="text-sm text-[#3DA7E3] hover:underline flex items-center gap-1"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <Card className="border border-gray-200 text-center py-8">
          <Heart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">
            Ajoutez des documents ou vidéos à vos favoris
          </p>
        </Card>
      </section>
    </div>
  );
}
