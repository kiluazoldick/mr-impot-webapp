"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Heart,
  Share2,
  Eye,
  Calendar,
  User,
  FileText,
  BookOpen,
  Loader2,
} from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import { publicApi } from "@/services/api";
import { supabase } from "@/lib/supabase";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const [document, setDocument] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadDocument = async () => {
      setIsLoading(true);
      try {
        const doc: any = await publicApi.getDocument(documentId);
        setDocument(doc);

        if (doc.file_path) {
          const { data: urlData } = await supabase.storage
            .from("documents")
            .createSignedUrl(doc.file_path, 3600);
          if (urlData?.signedUrl) setPdfUrl(urlData.signedUrl);
        }
      } catch (error) {
        console.error("Erreur chargement document:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDocument();
  }, [documentId]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const result: any = await publicApi.downloadDocument(documentId);
      if (result?.url) window.open(result.url, "_blank");
    } catch (error) {
      console.error("Erreur téléchargement:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#3DA7E3] animate-spin mx-auto" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 text-black/20 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-black mb-2">
          Document non trouvé
        </h2>
        <Link href="/dashboard/documents">
          <Button
            variant="primary"
            className="bg-[#F49600] hover:bg-[#F49600]/90"
          >
            Retour aux documents
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-black/60" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-black">
              {document.title_fr}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-[#3DA7E3]">
                {document.category?.name_fr || "-"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {}}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-black/60"
          >
            <Heart className="w-5 h-5" />
          </button>
          <button
            onClick={() => {}}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-black/60"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 p-2 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3DA7E3]" />
                <span className="text-sm text-black/60">
                  Aperçu du document
                </span>
              </div>
              <Badge variant="default" size="sm">
                PDF
              </Badge>
            </div>
            {pdfUrl ? (
              <iframe src={pdfUrl} className="w-full h-[600px]" title="PDF" />
            ) : (
              <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8">
                  <FileText className="w-20 h-20 text-black/20 mx-auto mb-4" />
                  <Button
                    variant="primary"
                    onClick={handleDownload}
                    isLoading={isDownloading}
                    className="bg-[#F49600] hover:bg-[#F49600]/90"
                  >
                    <Download className="w-4 h-4 mr-2" /> Télécharger le PDF
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4">
              Informations
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Eye className="w-4 h-4 text-black/40 mt-0.5" />
                <div>
                  <p className="text-sm text-black/60">Vues</p>
                  <p className="font-medium text-black">
                    {document.view_count || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="w-4 h-4 text-black/40 mt-0.5" />
                <div>
                  <p className="text-sm text-black/60">Téléchargements</p>
                  <p className="font-medium text-black">
                    {document.download_count || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-black/40 mt-0.5" />
                <div>
                  <p className="text-sm text-black/60">Date de publication</p>
                  <p className="font-medium text-black">
                    {new Date(document.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-2">
              Description
            </h3>
            <p className="text-black/70 text-sm leading-relaxed">
              {document.description_fr || ""}
            </p>
          </Card>

          <Card className="border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-3">Actions</h3>
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full bg-[#F49600] hover:bg-[#F49600]/90"
                onClick={handleDownload}
                isLoading={isDownloading}
              >
                <Download className="w-4 h-4 mr-2" /> Télécharger le document
              </Button>
              <Link href="/dashboard/documents">
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" /> Voir tous les documents
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
