"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderTree,
  FileText,
  Video,
  ChevronRight,
  Eye,
  Download,
  Heart,
  ArrowLeft,
} from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import { publicApi } from "@/services/api";

interface Category {
  id: string;
  name_fr: string;
  name_en: string;
  slug: string;
  description_fr?: string;
  description_en?: string;
  parent_id: string | null;
  subcategories?: Category[];
}

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

function CategoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("cat");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [categoryDocs, setCategoryDocs] = useState<DocItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await publicApi.getCategories();
        const list = Array.isArray(data) ? data : (data as any)?.data || [];
        const mainCats = list.filter((c: Category) => !c.parent_id);
        const subCats = list.filter((c: Category) => c.parent_id);
        const catsWithSubs = mainCats.map((cat: Category) => ({
          ...cat,
          subcategories: subCats.filter(
            (sub: Category) => sub.parent_id === cat.id,
          ),
        }));
        setCategories(catsWithSubs);
      } catch (error) {
        console.error("Erreur chargement catégories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Charger les documents d'une catégorie
  useEffect(() => {
    if (categorySlug) {
      const category = categories.find((cat) => cat.slug === categorySlug);
      if (category) {
        setSelectedCategory(category);
        loadCategoryDocuments(category);
      } else {
        setSelectedCategory(null);
        setCategoryDocs([]);
      }
    } else {
      setSelectedCategory(null);
      setCategoryDocs([]);
    }
  }, [categorySlug, categories]);

  const loadCategoryDocuments = async (category: Category) => {
    setIsLoading(true);
    try {
      const result = await publicApi.getDocuments({
        category_id: category.id,
        page: "1",
        limit: "50",
      });
      setCategoryDocs((result as any)?.data || []);
    } catch (error) {
      console.error("Erreur chargement documents:", error);
      setCategoryDocs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    router.push(`/dashboard/categories?cat=${category.slug}`);
  };

  const handleBackToCategories = () => {
    router.push("/dashboard/categories");
  };

  // Si une catégorie est sélectionnée, afficher les documents
  if (selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToCategories}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-black/60" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-black">
              {selectedCategory.name_fr}
            </h1>
            <p className="text-black/60 mt-1">
              {selectedCategory.description_fr ||
                `Explorez tous les documents de la catégorie ${selectedCategory.name_fr}`}
            </p>
          </div>
        </div>

        {selectedCategory.subcategories &&
          selectedCategory.subcategories.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-black mb-3">
                Sous-catégories
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedCategory.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() =>
                      router.push(`/dashboard/categories?cat=${sub.slug}`)
                    }
                    className="px-3 py-1.5 bg-gray-100 hover:bg-[#3DA7E3]/10 rounded-full text-sm text-black/70 hover:text-[#3DA7E3] transition-colors"
                  >
                    {sub.name_fr}
                  </button>
                ))}
              </div>
            </div>
          )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">
              Documents ({categoryDocs.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3DA7E3]"></div>
            </div>
          ) : categoryDocs.length === 0 ? (
            <Card className="border border-gray-200 text-center py-12">
              <FileText className="w-12 h-12 text-black/20 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-black mb-1">
                Aucun document
              </h3>
              <p className="text-black/50 text-sm">
                Aucun document disponible dans cette catégorie.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {categoryDocs.map((doc) => (
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
                        <div>
                          <h3 className="font-semibold text-black group-hover:text-[#3DA7E3] transition-colors">
                            {doc.title_fr}
                          </h3>
                          <p className="text-sm text-black/60 mt-0.5 line-clamp-1">
                            {doc.description_fr || ""}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <Badge variant="default" size="sm">
                              PDF
                            </Badge>
                            <span className="text-xs text-black/40 flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {doc.view_count || 0}{" "}
                              vues
                            </span>
                            <span className="text-xs text-black/40 flex items-center gap-1">
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
                          <Heart className="w-4 h-4 text-black/40 hover:text-[#F49600]" />
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

  // Vue principale : toutes les catégories
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Catégories</h1>
        <p className="text-black/60 mt-1">
          Parcourez tous nos documents et vidéos par catégorie
        </p>
      </div>

      {loadingCategories ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="group text-left"
            >
              <Card className="border border-gray-200 hover:border-[#3DA7E3] hover:shadow-md transition-all h-full">
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: "#3DA7E310" }}
                  >
                    <FolderTree
                      className="w-6 h-6"
                      style={{ color: "#3DA7E3" }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black group-hover:text-[#3DA7E3] transition-colors">
                      {category.name_fr}
                    </h3>
                    {category.description_fr && (
                      <p className="text-sm text-black/60 mt-1 line-clamp-2">
                        {category.description_fr}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-black/40">
                        {category.subcategories?.length || 0} sous-catégories
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-black/30 group-hover:text-[#3DA7E3] transition-colors flex-shrink-0" />
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3DA7E3]"></div>
        </div>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
}
