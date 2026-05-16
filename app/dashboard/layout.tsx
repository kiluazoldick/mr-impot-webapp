"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier la session Supabase (marche pour Google ET email)
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.access_token) {
          localStorage.setItem("sb-access-token", session.access_token);
          localStorage.setItem("user-email", session.user.email || "");

          // Récupérer le profil depuis Supabase directement
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            const name =
              [profile.first_name, profile.last_name]
                .filter(Boolean)
                .join(" ") ||
              session.user.email?.split("@")[0] ||
              "Utilisateur";
            localStorage.setItem("user-name", name);
            setUserName(name);
          }

          setIsAuth(true);
          setLoading(false);
          return;
        }

        // Fallback : vérifier le token localStorage (email/password)
        const token = localStorage.getItem("sb-access-token");
        if (!token) {
          router.replace("/login");
          return;
        }

        setIsAuth(true);
      } catch {
        localStorage.clear();
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#3DA7E3]" />
      </div>
    );
  }

  if (!isAuth) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
