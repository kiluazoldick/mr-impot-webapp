"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileText, Video, Search, Loader2, Eye } from "lucide-react";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import { publicApi } from "@/services/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [documents, setDocuments] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const [docsRes, vidsRes] = await Promise.all([
        publicApi.getDocuments({ search: searchQuery, page: "1", limit: "10" }),
        publicApi.getVideos({ search: searchQuery, page: "1", limit: "5" }),
      ]);
      setDocuments(docsRes?.data || []);
      setVideos(vidsRes?.data || []);

      // Si peu de résultats, relancer en full-text
      if ((docsRes?.data || []).length < 3 && searchQuery.length > 3) {
        const fullTextRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/public/search?q=${encodeURIComponent(searchQuery)}&mode=fulltext&limit=10`,
          { credentials: "include" },
        );
        const fullTextData = await fullTextRes.json();
        if (fullTextData?.data?.length > 0) {
          setDocuments(fullTextData.data);
        }
      }
    } catch (error) {
      console.error("Erreur recherche:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) handleSearch(query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.history.pushState(
        {},
        "",
        `/dashboard/search?q=${encodeURIComponent(searchInput)}`,
      );
      handleSearch(searchInput);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recherche</h1>
        <p className="text-gray-500 mt-1">
          Recherchez dans tous les documents et vidéos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Rechercher un document, une vidéo, un article de loi..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#3DA7E3] focus:ring-2 focus:ring-[#3DA7E3]/20 transition-all shadow-sm"
        />
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#3DA7E3]" />
        </div>
      ) : query ? (
        <div className="space-y-8">
          {/* Résultats documents */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Documents ({documents.length})
            </h2>
            {documents.length === 0 ? (
              <Card className="border border-gray-200 text-center py-8">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Aucun document trouvé</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/dashboard/documents/${doc.id}`}
                    className="block"
                  >
                    <Card className="border border-gray-200 hover:border-[#3DA7E3] hover:shadow-md transition-all">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[#3DA7E310]">
                          <FileText className="w-5 h-5 text-[#3DA7E3]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {doc.title_fr}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {doc.description_fr || ""}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="default" size="sm">
                              {doc.category?.name_fr || "-"}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {doc.view_count || 0} vues
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Résultats vidéos */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Vidéos ({videos.length})
            </h2>
            {videos.length === 0 ? (
              <Card className="border border-gray-200 text-center py-8">
                <Video className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Aucune vidéo trouvée</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/dashboard/videos/${video.id}`}
                    className="block"
                  >
                    <Card className="border border-gray-200 hover:border-[#3DA7E3] hover:shadow-md transition-all">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[#F4960010]">
                          <Video className="w-5 h-5 text-[#F49600]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {video.title_fr}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {video.description_fr || ""}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="default" size="sm">
                              {video.category?.name_fr || "-"}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {video.view_count || 0} vues
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
