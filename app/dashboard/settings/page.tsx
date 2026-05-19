"use client";

import { useState } from "react";
import { Globe, Lock, Eye, EyeOff, Shield, Save, Loader2 } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";

export default function SettingsPage() {
  const [language, setLanguage] = useState("fr");
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleSaveLanguage = () => {
    setSaving(true);
    localStorage.setItem("preferred-language", language);
    setTimeout(() => {
      setSaving(false);
      alert("Langue enregistrée !");
    }, 500);
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      alert("Mot de passe modifié !");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Paramètres</h1>
        <p className="text-black/60 mt-1">Gérez vos préférences</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Langue */}
        <Card className="border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-[#3DA7E3]" />
            <h3 className="text-lg font-semibold text-black">Langue</h3>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage("fr")}
              className={`px-4 py-2 rounded-lg border transition-all ${language === "fr" ? "border-[#3DA7E3] bg-[#3DA7E3]/10 text-[#3DA7E3]" : "border-gray-200 text-black/70"}`}
            >
              Français
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-4 py-2 rounded-lg border transition-all ${language === "en" ? "border-[#3DA7E3] bg-[#3DA7E3]/10 text-[#3DA7E3]" : "border-gray-200 text-black/70"}`}
            >
              English
            </button>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleSaveLanguage}
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
        </Card>

        {/* Sécurité */}
        <Card className="border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-[#3DA7E3]" />
            <h3 className="text-lg font-semibold text-black">
              Changer le mot de passe
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Mot de passe actuel
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Mot de passe actuel"
                  className="w-full px-3 py-2 pr-10 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-[#3DA7E3]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4 text-black/40" />
                  ) : (
                    <Eye className="w-4 h-4 text-black/40" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Nouveau mot de passe"
                  className="w-full px-3 py-2 pr-10 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-[#3DA7E3]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4 text-black/40" />
                  ) : (
                    <Eye className="w-4 h-4 text-black/40" />
                  )}
                </button>
              </div>
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={saving}
              className="bg-[#F49600] hover:bg-[#F49600]/90"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Changer le mot de passe
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
