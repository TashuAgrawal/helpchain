"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, LogOut, Bell, Sun, Moon } from "lucide-react";
import { Button } from "../../ui/button";
import getUserNotifications from "@/Helper/Notifications/GetNotification";
import { useRouter } from "next/navigation";

interface NavbarProps {
  links?: { label: string; href: string }[];
  onLogout?: () => void;
  userName?: string;
  ngoId?: string;
}

export function NgoNavbar({ links = [], onLogout, userName, ngoId }: NavbarProps) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const fetchUnreadCount = useCallback(async () => {
    const id = ngoId;
    if (!id) return;
    try {
      const data = await getUserNotifications(id);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (error) {
      console.error("Failed to fetch NGO notifications:", error);
    }
  }, [ngoId]);

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center transition-colors duration-300">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-gray-900 dark:text-white text-lg font-semibold transition-colors duration-300">
              TransparentAid
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-teal-400 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* User Info & Controls */}
          <div className="flex items-center gap-4">

            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              onClick={() => router.push("/notifications")}
              className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-teal-400 transition-colors duration-300"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-md">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : (
                /* Static "active" dot when no unread but ngoId is known */
                ngoId && (
                  <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-gray-400 ring-2 ring-white dark:ring-gray-900" />
                )
              )}
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Dark Mode"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-teal-400 transition-colors duration-300"
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            {/* User Name */}
            {userName && (
              <span className="text-gray-700 dark:text-gray-200 hidden sm:inline transition-colors duration-300">
                {userName}
              </span>
            )}

            {/* Logout Button */}
            {onLogout && (
              <Button
                onClick={onLogout}
                variant="ghost"
                size="sm"
                className="gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
