"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Search,
  Filter,
  X,
  Download,
  Eye,
  Heart,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import { publicApi } from "@/services/api";

interface DocItem {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr?: string;
  description_en?: string;
  category?: { id: string; name_fr: string; name_en: string; slug: string };
  file_path?: string;
  created_at: string;
  view_count?: number;
  download_count?: number;
}

interface CatItem {
  id: string;
  name_fr: string;
  name_en: string;
  slug: string;
}

function DocumentsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [showFilters, setShowFilters] = useState(false);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [categories, setCategories] = useState<CatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsRes, docsRes] = await Promise.all([
          publicApi.getCategories(),
          publicApi.getDocuments({ page: String(page), limit: "20" }),
        ]);
        const catsList = Array.isArray(catsRes)
          ? catsRes
          : (catsRes as any)?.data || [];
        setCategories(catsList.filter((c: CatItem) => !c.parent_id));
        setDocuments(docsRes?.data || []);
        setTotalPages(docsRes?.totalPages || 1);
        setTotal(docsRes?.total || 0);
      } catch (error) {
        console.error("Erreur chargement documents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      (doc.title_fr || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.title_en || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description_fr || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || doc.category?.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory !== "" || searchQuery !== "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-500 mt-1">
          Accédez à tous vos documents juridiques
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
              placeholder="Rechercher un document..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#3DA7E3] focus:ring-1 focus:ring-[#3DA7E3] transition-all"
            />
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            <Filter className="w-4 h-4 mr-2" /> Filtres
          </Button>
        </div>

        <div className="hidden sm:flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Filter className="w-4 h-4" /> Filtres :
          </span>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#3DA7E3] cursor-pointer"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name_fr}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#F49600] hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Effacer les filtres
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filteredDocuments.length} document(s) trouvé(s)
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="border border-gray-200 text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Aucun document trouvé
            </h3>
            <p className="text-gray-500 text-sm">
              Essayez de modifier vos filtres ou votre recherche
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-4"
            >
              Voir tous les documents
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <Link
                key={doc.id}
                href={`/dashboard/documents/${doc.id}`}
                className="block"
              >
                <Card className="border border-gray-200 hover:border-[#3DA7E3] hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: "#3DA7E310" }}
                      >
                        <FileText
                          className="w-5 h-5"
                          style={{ color: "#3DA7E3" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#3DA7E3] transition-colors">
                          {doc.title_fr}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                          {doc.description_fr || ""}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <Badge variant="default" size="sm">
                            {doc.category?.name_fr || "-"}
                          </Badge>
                          <Badge variant="default" size="sm">
                            PDF
                          </Badge>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {doc.view_count || 0}{" "}
                            vues
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Download className="w-3 h-3" />{" "}
                            {doc.download_count || 0} téléchargements
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-gray-400 hover:text-[#F49600]" />
                      </button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" /> Télécharger
                      </Button>
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

export default function DocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#3DA7E3]" />
        </div>
      }
    >
      <DocumentsContent />
    </Suspense>
  );
}
