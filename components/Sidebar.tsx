"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Sparkles, 
  Gift, 
  Settings, 
  User, 
  X,
  LogOut,
  UserCircle,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isSignedIn: boolean;
  setIsSignedIn: (val: boolean) => void;
  onOpenSignIn: () => void;
  addNotification?: (title: string, description: string) => void;
  onSignOut?: () => void;
  currentUser?: any;
  curationsCount?: number;
  savedCount?: number;
  recipientsCount?: number;
  onUpdateProfile?: (updatedProfile: any) => Promise<void>;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen,
  isSignedIn,
  setIsSignedIn,
  onOpenSignIn,
  addNotification,
  onSignOut,
  currentUser,
  curationsCount,
  savedCount,
  recipientsCount,
  onUpdateProfile,
}: SidebarProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    subscription: "Gift Curator Pro",
    memberSince: "January 15, 2024",
  });
  const [editFormData, setEditFormData] = useState(profileData);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Sync with currentUser prop if provided
  useEffect(() => {
    if (currentUser) {
      const formattedProfile = {
        name: currentUser.name || "Jane Doe",
        email: currentUser.email || "jane.doe@example.com",
        subscription: currentUser.subscription || "Gift Curator Pro",
        memberSince: currentUser.memberSince || (currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "January 15, 2024"),
      };
      setProfileData(formattedProfile);
      setEditFormData(formattedProfile);
    }
  }, [currentUser]);

  const handleEditClick = () => {
    setEditFormData(profileData);
    setProfileError(null);
    setIsEditMode(true);
  };

  const handleSaveProfile = async () => {
    setProfileError(null);
    if (!editFormData.name.trim()) {
      setProfileError("Full Name is required.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    if (!emailRegex.test(editFormData.email)) {
      setProfileError("Only Gmail addresses are accepted (e.g., name@gmail.com).");
      return;
    }

    setProfileData(editFormData);
    if (!currentUser) {
      localStorage.setItem("userProfile", JSON.stringify(editFormData));
    }
    setIsEditMode(false);
    if (onUpdateProfile) {
      try {
        await onUpdateProfile(editFormData);
      } catch (err) {
        console.error("Failed to save profile:", err);
      }
    }
    if (addNotification) {
      addNotification("Profile updated", "Your profile details have been successfully updated.");
    }
  };

  const handleCancel = () => {
    setEditFormData(profileData);
    setProfileError(null);
    setIsEditMode(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("userProfile");
    localStorage.setItem("wasSignedOut", "true");
    setIsSignedIn(false);
    setProfileMenuOpen(false);
    setProfileModalOpen(false);
    setActiveTab("dashboard");
    if (onSignOut) {
      onSignOut();
    }
    if (addNotification) {
      addNotification("Signed out", "You have successfully signed out of your session.");
    }
  };

  // Load profile data on mount
  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setTimeout(() => {
      setIsMounted(true);
      if (typeof window === "undefined") return;
      
      if (!currentUser) {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            setProfileData(parsedProfile);
            setEditFormData(parsedProfile);
            setIsSignedIn(true);
          } catch (error) {
            console.error("Failed to load profile data:", error);
            setIsSignedIn(false);
          }
        } else {
          setIsSignedIn(false);
        }
      }
    }, 0);
    return () => {
      if (timer) clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // When isSignedIn flips to true, re-read localStorage if not using currentUser
  useEffect(() => {
    if (!isSignedIn || currentUser) return;
    const timer = setTimeout(() => {
      const saved = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null;
      if (saved) {
        try {
          const p = JSON.parse(saved);
          setProfileData(p);
          setEditFormData(p);
        } catch {
          // ignore parse errors
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [isSignedIn, currentUser]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "generator", label: "Gift Curation", icon: Sparkles },
    { id: "saved", label: "Saved Ideas", icon: Gift },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 
        bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] 
        backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Header/Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Gift size={16} />
            </div>
            <span className="font-black text-lg tracking-tight text-[var(--foreground)]">
              Wrappr<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">.AI</span>
            </span>
          </div>
          {/* Close button on mobile */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white"
            aria-label="Close sidebar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false); // Close sidebar on mobile after clicking
                }}
                className={`
                  flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/10 border-l-4 border-violet-500 text-violet-500 dark:text-violet-300 shadow-md" 
                    : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
                  }
                `}
              >
                <Icon size={18} className={isActive ? "text-violet-500" : "text-gray-500 group-hover:text-gray-400"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer/Profile */}
        <div className="p-4 border-t border-[var(--sidebar-border)] bg-black/5 relative">
          <button
            onClick={() => {
              if (isMounted && !isSignedIn) {
                onOpenSignIn();
              } else {
                setProfileMenuOpen(!profileMenuOpen);
              }
            }}
            className="flex items-center gap-3 px-2 py-1.5 w-full rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer group"
            aria-label={isSignedIn ? "Profile menu" : "Sign In"}
          >
            {!isMounted || !isSignedIn ? (
              <div className="w-10 h-10 rounded-full bg-gray-500/10 border border-gray-500/20 flex items-center justify-center text-gray-400 shadow-inner group-hover:bg-gray-500/20 transition-colors duration-200">
                <User size={18} />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-inner group-hover:bg-violet-600/30 transition-colors duration-200">
                <User size={18} />
              </div>
            )}
            <div className="flex-grow min-w-0 text-left">
              <h4 className="text-sm font-bold text-[var(--foreground)] truncate">
                {!isMounted ? "Guest User" : (isSignedIn ? profileData.name : "Guest User")}
              </h4>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {!isMounted ? "Click to Sign In" : (isSignedIn ? profileData.subscription : "Click to Sign In")}
              </p>
            </div>
            {isMounted && isSignedIn && (
              <ChevronRight size={16} className={`text-gray-500 transition-transform duration-200 ${profileMenuOpen ? "rotate-90" : ""}`} />
            )}
          </button>

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl shadow-lg overflow-hidden z-40">
              <button
                onClick={() => {
                  setProfileModalOpen(true);
                  setProfileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[var(--foreground)] hover:bg-violet-500/10 transition-colors duration-150 border-b border-[var(--input-border)]"
              >
                <UserCircle size={16} className="text-violet-500" />
                <span>View Profile</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setProfileMenuOpen(false);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[var(--foreground)] hover:bg-violet-500/10 transition-colors duration-150 border-b border-[var(--input-border)]"
              >
                <Settings size={16} className="text-indigo-500" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors duration-150"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}

        </div>
      </aside>

      {/* Profile Modal — rendered outside aside to escape backdrop-blur stacking context */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-[9997] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600/20 to-rose-600/20 border-b border-[var(--card-border)] px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--foreground)]">Profile</h2>
              <button
                onClick={() => { setProfileModalOpen(false); setProfileError(null); }}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors duration-150"
                aria-label="Close profile modal"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-5">
              {isEditMode ? (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                  {profileError && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-medium">
                      {profileError}
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--sidebar-bg)] border border-[var(--input-border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-violet-500 transition-colors duration-150"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--sidebar-bg)] border border-[var(--input-border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-violet-500 transition-colors duration-150 text-sm"
                      placeholder="e.g. name@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Subscription</label>
                    <input
                      type="text"
                      value={editFormData.subscription}
                      disabled
                      title="Subscription is not editable"
                      className="w-full px-3 py-2 bg-slate-900 border border-[var(--input-border)] rounded-lg text-[var(--text-muted)] cursor-not-allowed"
                    />
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-rose-600 flex items-center justify-center text-white shadow-lg">
                      <User size={32} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Full Name</p>
                      <p className="text-sm text-[var(--foreground)] mt-1">{profileData.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Email</p>
                      <p className="text-sm text-[var(--foreground)] mt-1">{profileData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Subscription</p>
                      <p className="text-sm text-violet-400 font-medium mt-1">{profileData.subscription}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Member Since</p>
                      <p className="text-sm text-[var(--foreground)] mt-1">{profileData.memberSince}</p>
                    </div>
                  </div>
                  <div className="h-px bg-[var(--input-border)]" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-violet-500">{curationsCount ?? 24}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Curations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-rose-500">{savedCount ?? 18}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Saved Ideas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-indigo-500">{recipientsCount ?? 42}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Recipients</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--card-border)] px-6 py-4 flex gap-3">
              {isEditMode ? (
                <>
                  <button onClick={handleSaveProfile} className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors duration-150 font-medium text-sm">
                    Save Changes
                  </button>
                  <button onClick={handleCancel} className="flex-1 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg transition-colors duration-150 font-medium text-sm">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleEditClick} className="flex-1 px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 rounded-lg transition-colors duration-150 font-medium text-sm">
                    Edit Profile
                  </button>
                  <button onClick={() => setProfileModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg transition-colors duration-150 font-medium text-sm">
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
