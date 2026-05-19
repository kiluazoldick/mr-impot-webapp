"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Calendar, Save, Loader2 } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (data) {
            setProfile(data);
            setForm({
              first_name: data.first_name || "",
              last_name: data.last_name || "",
            });
          }
        }
      } catch (error) {
        console.error("Erreur chargement profil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: form.first_name,
          last_name: form.last_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);
      if (error) throw error;
      // Mettre à jour le localStorage
      const name =
        [form.first_name, form.last_name].filter(Boolean).join(" ") ||
        profile.email?.split("@")[0] ||
        "Utilisateur";
      localStorage.setItem("user-name", name);
      alert("Profil mis à jour !");
    } catch (error: any) {
      console.error("Erreur sauvegarde:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#3DA7E3]" />
      </div>
    );
  }

  const initials =
    [form.first_name, form.last_name]
      .filter(Boolean)
      .map((n: string) => n[0]?.toUpperCase())
      .join("") || "U";
  const fullName =
    [form.first_name, form.last_name].filter(Boolean).join(" ") ||
    profile?.email?.split("@")[0] ||
    "Utilisateur";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Mon profil</h1>
        <p className="text-black/60 mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-80 flex-shrink-0">
          <Card className="border border-gray-200 text-center">
            <div className="h-20 w-20 rounded-full bg-[#3DA7E3] text-white flex items-center justify-center text-2xl font-bold mx-auto">
              {initials}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-black">
              {fullName}
            </h2>
            <p className="text-sm text-black/60 mt-1">
              Membre depuis{" "}
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "-"}
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-black/40" />
                <span className="text-black/70">{profile?.email || "-"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <UserIcon className="w-4 h-4 text-black/40" />
                <span className="text-black/70">
                  {profile?.role === "admin" ? "Administrateur" : "Utilisateur"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-black/40" />
                <span className="text-black/70">
                  Inscrit le{" "}
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex-1">
          <Card className="border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4">
              Informations personnelles
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) =>
                      setForm({ ...form, first_name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-[#3DA7E3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) =>
                      setForm({ ...form, last_name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-[#3DA7E3]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#F49600] hover:bg-[#F49600]/90"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Enregistrer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
