"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  Eye,
  Calendar,
  Video,
  BookOpen,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Loader2,
} from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { publicApi } from "@/services/api";
import { supabase } from "@/lib/supabase";

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const loadVideo = async () => {
      setIsLoading(true);
      try {
        const vid: any = await publicApi.getVideo(videoId);
        setVideo(vid);
        if (vid.file_path) {
          const { data: urlData } = await supabase.storage
            .from("videos")
            .createSignedUrl(vid.file_path, 3600);
          if (urlData?.signedUrl) setVideoUrl(urlData.signedUrl);
        }
      } catch (error) {
        console.error("Erreur chargement vidéo:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadVideo();
  }, [videoId]);

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#3DA7E3] animate-spin mx-auto" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-20">
        <Video className="w-16 h-16 text-black/20 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-black mb-2">
          Vidéo non trouvée
        </h2>
        <Link href="/dashboard/videos">
          <Button
            variant="primary"
            className="bg-[#F49600] hover:bg-[#F49600]/90"
          >
            Retour aux vidéos
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
            <h1 className="text-2xl font-bold text-black">{video.title_fr}</h1>
            <p className="text-sm text-black/60 mt-1">
              {video.category?.name_fr || ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-black/60">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-black/60">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 overflow-hidden p-0">
            <div className="relative bg-black">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full aspect-video"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  onLoadedMetadata={(e) =>
                    setDuration(e.currentTarget.duration)
                  }
                />
              ) : (
                <div className="aspect-video flex items-center justify-center">
                  <Video className="w-16 h-16 text-white/40" />
                </div>
              )}
              {videoUrl && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-[#3DA7E3] transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#3DA7E3] rounded-full transition-all"
                        style={{
                          width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-[#3DA7E3] transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                    {video.view_count || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-black/40 mt-0.5" />
                <div>
                  <p className="text-sm text-black/60">Date de publication</p>
                  <p className="font-medium text-black">
                    {new Date(video.created_at).toLocaleDateString("fr-FR")}
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
              {video.description_fr || ""}
            </p>
          </Card>
          <Card className="border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-3">Actions</h3>
            <Link href="/dashboard/videos">
              <Button variant="outline" className="w-full">
                <BookOpen className="w-4 h-4 mr-2" /> Voir toutes les vidéos
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
