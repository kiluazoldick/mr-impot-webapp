"use client";

import { useState } from "react";
import { FileText, Download, Search, Users, TrendingUp } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import { documents, recentActivities } from "@/data/mockData";
import { formatDateTime } from "@/utils/formatters";

export default function DashboardPage() {
  const stats = [
    {
      title: "Documents consultés",
      value: "245",
      change: "+12%",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Téléchargements",
      value: "89",
      change: "+8%",
      icon: Download,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Recherches",
      value: "156",
      change: "+23%",
      icon: Search,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Documents déposés",
      value: "12",
      change: "+3",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case "download":
        return "⬇️";
      case "search":
        return "🔍";
      case "view":
        return "👁️";
      default:
        return "📄";
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case "download":
        return "a téléchargé";
      case "search":
        return "a recherché";
      case "view":
        return "a consulté";
      default:
        return "a interagi avec";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">
          Bienvenue sur votre espace personnel Mr Impôt
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <div className="mt-2">
                  <Badge variant="success" size="sm">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    {stat.change}
                  </Badge>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Documents & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Documents récents
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/dashboard/documents")}
              >
                Voir tout
              </Button>
            </div>
            <div className="space-y-3">
              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/dashboard/documents/${doc.id}`)
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.title}</p>
                      <p className="text-sm text-gray-500">
                        {doc.category.name} • {doc.views} vues
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" size="sm">
                    {doc.format}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Activité récente
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="text-xl">
                    {getActionIcon(activity.action)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {getActionText(activity.action)}{" "}
                      <span className="font-medium">{activity.document}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateTime(activity.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Categories Quick Access */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Accès rapide par catégorie
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Droit Fiscal",
            "Droit des Sociétés",
            "Droit du Travail",
            "Jurisprudence",
          ].map((category) => (
            <button
              key={category}
              onClick={() =>
                (window.location.href = `/dashboard/documents?category=${category.toLowerCase().replace(/\s/g, "-")}`)
              }
              className="p-4 text-center rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
            >
              <p className="font-medium text-gray-900">{category}</p>
              <p className="text-sm text-gray-500 mt-1">Accéder</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
