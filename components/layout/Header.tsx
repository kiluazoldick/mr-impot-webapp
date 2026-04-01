"use client";

import {
  Menu,
  Bell,
  Search,
  User,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import Avatar from "@/components/common/Avatar";
import Dropdown, { DropdownItem } from "@/components/common/Dropdown";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { toggle } = useSidebar();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const userMenuTrigger = (
    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
      <Avatar fallback="John Doe" size="sm" />
      <span className="hidden md:inline text-sm font-medium text-gray-700">
        John Doe
      </span>
      <ChevronDown className="hidden md:block w-4 h-4 text-gray-500" />
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
            Tableau de bord
          </h2>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des documents, vidéos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </form>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <Dropdown trigger={userMenuTrigger} align="right">
            <DropdownItem onClick={() => router.push("/dashboard/profile")}>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Mon profil</span>
              </div>
            </DropdownItem>
            <DropdownItem onClick={() => router.push("/dashboard/settings")}>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </div>
            </DropdownItem>
            <div className="border-t border-gray-200 my-1"></div>
            <DropdownItem onClick={() => console.log("Logout")}>
              <div className="flex items-center gap-2 text-red-600">
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </div>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
