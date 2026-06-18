"use client";

import { useState, useEffect } from "react";
import { Menu, Sun, Moon, Bell } from "lucide-react";
import React from "react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  isDbDemoMode?: boolean;
}

export default function Header({ onMenuClick, title, notifications, setNotifications, isDbDemoMode = true }: HeaderProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTheme = localStorage.getItem("theme");
    const timer = setTimeout(() => {
      const isLight = storedTheme === "light" || document.documentElement.classList.contains("light");
      if (isLight) {
        document.documentElement.classList.add("light");
        setTheme("light");
      } else {
        document.documentElement.classList.remove("light");
        setTheme("dark");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.add("light");
      setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[var(--header-bg)] border-b border-[var(--sidebar-border)] backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-3">
        {/* Burger menu for mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-[var(--foreground)] focus:outline-none transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Page Title */}
        <h1 className="text-lg md:text-xl font-bold text-[var(--foreground)] tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Demo Mode or Live Cloud Pill */}
        {isDbDemoMode ? (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full text-violet-600 dark:text-violet-400">
            <Bell size={12} className="animate-pulse" />
            <span>Demo Mode (Local Mock)</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Sync (Active)</span>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)] hover:bg-white/5 hover:border-violet-500/30 transition-all duration-200 cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-600" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((p) => !p)}
            className="p-2 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)] hover:bg-white/5 hover:border-violet-500/30 transition-all duration-200 relative cursor-pointer"
            aria-label="Open notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              </>
            )}
          </button>

          {notificationsOpen && (
            <div className="fixed right-4 top-20 w-[min(20rem,calc(100vw-2rem))] max-w-full max-h-[calc(100vh-6rem)] overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--background)] shadow-2xl shadow-black/15 ring-1 ring-black/5 z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--input-border)] bg-[var(--input-bg)]">
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">Notifications</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{unreadCount} new</p>
                </div>
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-violet-500 hover:text-violet-400 font-semibold"
                  type="button"
                >
                  Mark all read
                </button>
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[12px] text-[var(--text-muted)]">
                    No activity yet. Start a curation to see updates here.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`px-4 py-3 border-b border-[var(--input-border)] transition-colors ${
                        !item.read ? "bg-violet-500/5" : "bg-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mt-1">{item.description}</p>
                        </div>
                        {!item.read && (
                          <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] mt-2">{item.timestamp}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-[var(--input-bg)] text-[11px] text-[var(--text-muted)]">
                Live activity from your current session.
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
