"use client";

import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import RecommendationGenerator from "@/components/RecommendationGenerator";
import RecommendationResults from "@/components/RecommendationResults";
import GiftCard from "@/components/GiftCard";
import {
  Sparkles,
  Gift,
  TrendingUp,
  Users,
  Heart,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  X
} from "lucide-react";
import React from "react";
import { supabase } from "@/lib/supabase";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface GiftRecommendation {
  id?: string;
  name: string;
  description: string;
  estimatedPrice: string;
  originalRegion?: string;
  whyItFits: string;
  category: string;
  sparkOption?: string;
  matchScore?: number;
}

interface RecipientInfo {
  relationship: string;
  age: string;
  occasion: string;
  interests: string;
  budget: string;
  vibe: string[];
}

type RecentProfile = RecipientInfo & { name: string };

const DEFAULT_PROFILES: RecentProfile[] = [
  { name: "Spouse", relationship: "Spouse", occasion: "Anniversary", age: "Adult", budget: "₹5,000 - ₹10,000", interests: "Gaming, Cooking", vibe: ["Sentimental", "Techie"] },
  { name: "Mom", relationship: "Mom", occasion: "Mother's Day", age: "Senior", budget: "₹2,500 - ₹5,000", interests: "Gardening, Tea", vibe: ["Cozy", "Practical"] },
  { name: "Best Friend", relationship: "Best Friend", occasion: "Birthday", age: "Young Adult", budget: "₹1,000 - ₹2,500", interests: "Camping, Coffee", vibe: ["Adventurous", "Trendy"] }
];

const DEFAULT_SAVED: GiftRecommendation[] = [
  {
    id: "sample-1",
    name: "Custom Star Map Poster",
    description: "A beautifully printed map of the stars at the exact date, time, and location of your choice (e.g., anniversary, birthday). Framed in a sleek matte black frame.",
    estimatedPrice: "₹2,500 - ₹4,500",
    whyItFits: "Highly sentimental and unique home decor piece, making it perfect for an anniversary.",
    category: "Cozy / Sentimental",
    sparkOption: "Wrap it with starry-patterned wrapping paper and write: 'This was the sky when my world changed.'",
    matchScore: 98
  },
  {
    id: "sample-3",
    name: "Retro Handheld Game Console",
    description: "A pocket-sized emulator console preloaded with thousands of classic retro games from the 8-bit and 16-bit eras, featuring an IPS color screen.",
    estimatedPrice: "₹5,550",
    whyItFits: "An absolute retro gaming nostalgia trip for techies and gamers.",
    category: "Tech / Gaming",
    sparkOption: "Preload a custom text file on the SD card displaying a personal birthday message.",
    matchScore: 94
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<GiftRecommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo | null>(null);
  const [defaultRegion, setDefaultRegion] = useState<string>("India (INR)");
  const [defaultModel, setDefaultModel] = useState<string>("gpt-4o-mini (Recommended)");
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [fadeExit, setFadeExit] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [signInModalOpen, setSignInModalOpen] = useState<boolean>(false);
  const [signInData, setSignInData] = useState({ name: "", email: "", subscription: "Gift Curator Pro" });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [totalCurations, setTotalCurations] = useState<number>(14);
  const [signInTab, setSignInTab] = useState<"signin" | "signup">("signin");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // --- Live Notifications ---
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "demo-mode",
      title: "Demo mode active",
      description: "Mock recommendations are shown while the API key is not configured.",
      timestamp: "Today",
      read: true,
    },
  ]);

  const addNotification = useCallback(async (title: string, description: string) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setNotifications((prev) => [
      { id: `${Date.now()}-${Math.random()}`, title, description, timestamp, read: false },
      ...prev.slice(0, 9), // keep max 10
    ]);

    if (supabase && currentUser) {
      try {
        await supabase
          .from("notifications")
          .insert([{
            user_id: currentUser.id,
            title,
            description,
            read: false
          }]);
      } catch (err) {
        console.error("Failed to push notification to Supabase:", err);
      }
    }
  }, [currentUser]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!supabase && !signInData.name.trim()) {
      setAuthError("Full Name is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    if (!emailRegex.test(signInData.email)) {
      setAuthError("Only Gmail addresses are accepted (e.g., name@gmail.com).");
      return;
    }

    setAuthLoading(true);

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: signInData.email,
          password: authPassword
        });
        if (error) throw error;
        
        setSignInModalOpen(false);
        setAuthPassword("");
        addNotification("Signed in", `Welcome back! Your curations are ready.`);
      } catch (err: any) {
        setAuthError(err.message || "Failed to authenticate.");
      } finally {
        setAuthLoading(false);
      }
    } else {
      const newProfile = {
        name: signInData.name || "Jane Doe",
        email: signInData.email,
        subscription: "Gift Curator Pro",
        memberSince: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };
      localStorage.setItem("userProfile", JSON.stringify(newProfile));
      setCurrentUser(newProfile);
      setIsSignedIn(true);
      setSignInModalOpen(false);
      setSignInData({ name: "", email: "", subscription: "Gift Curator Pro" });
      setAuthPassword("");
      setAuthLoading(false);
      addNotification("Signed in", `Welcome back, ${newProfile.name}! Your curations are ready.`);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!signInData.name.trim()) {
      setAuthError("Full Name is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    if (!emailRegex.test(signInData.email)) {
      setAuthError("Only Gmail addresses are accepted (e.g., name@gmail.com).");
      return;
    }

    setAuthLoading(true);

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: signInData.email,
          password: authPassword,
          options: {
            data: {
              name: signInData.name
            }
          }
        });
        if (error) throw error;

        if (data.user) {
          const newProfile = {
            id: data.user.id,
            name: signInData.name,
            email: signInData.email,
            subscription: "Gift Curator Pro"
          };
          
          const { error: profileErr } = await supabase
            .from("user_profiles")
            .insert([newProfile]);
          if (profileErr) throw profileErr;
          
          setCurrentUser(newProfile);
          setIsSignedIn(true);
        }

        setSignInModalOpen(false);
        setAuthPassword("");
        setSignInData({ name: "", email: "", subscription: "Gift Curator Pro" });
        addNotification("Account created", `Welcome to Wrappr.AI, ${signInData.name}!`);
      } catch (err: any) {
        setAuthError(err.message || "Failed to register account.");
      } finally {
        setAuthLoading(false);
      }
    }
  };

  const fetchUserProfile = async (user: any) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error && error.code === "PGRST116") {
        const newProfile = {
          id: user.id,
          name: user.user_metadata?.name || "New User",
          email: user.email,
          subscription: "Gift Curator Pro"
        };
        const { error: insertError } = await supabase
          .from("user_profiles")
          .insert([newProfile]);
        if (insertError) throw insertError;
        setCurrentUser(newProfile);
      } else if (error) {
        throw error;
      } else {
        setCurrentUser(data);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  // Dynamic Recent Recipient Profiles state
  const [recentProfiles, setRecentProfiles] = useState<RecentProfile[]>(DEFAULT_PROFILES);

  // Dynamic Saved recommendations state with default mock ideas
  const [savedRecommendations, setSavedRecommendations] = useState<GiftRecommendation[]>(DEFAULT_SAVED);

  const getAvgMatchScore = () => {
    if (savedRecommendations.length === 0) return "96%";
    const sum = savedRecommendations.reduce((acc, rec) => acc + (rec.matchScore || 95), 0);
    return `${Math.round(sum / savedRecommendations.length)}%`;
  };

  const REGION_BUDGETS: Record<string, string[]> = {
    "India (INR)": [
      "Under ₹1,000",
      "₹1,000 - ₹2,500",
      "₹2,500 - ₹5,000",
      "₹5,000 - ₹10,000",
      "₹10,000+"
    ],
    "United States (USD)": [
      "Under $25",
      "$25-$50",
      "$50-$100",
      "$100-$250",
      "$250+"
    ],
    "Europe (EUR)": [
      "Under €25",
      "€25-€50",
      "€50-€100",
      "€100-€250",
      "€250+"
    ],
    "United Kingdom (GBP)": [
      "Under £20",
      "£20-£40",
      "£40-£80",
      "£80-£200",
      "£200+"
    ]
  };

  const getBudgetOptions = (region: string) => {
    return REGION_BUDGETS[region] || REGION_BUDGETS["India (INR)"];
  };

  const findBudgetIndex = (label: string) => {
    for (const group of Object.values(REGION_BUDGETS)) {
      const idx = group.findIndex((option) => option === label);
      if (idx >= 0) {
        return idx;
      }
    }
    return -1;
  };

  const convertBudgetToRegion = (label: string, region: string) => {
    const index = findBudgetIndex(label);
    const options = getBudgetOptions(region);
    if (index >= 0 && index < options.length) {
      return options[index];
    }
    return options[2];
  };

  const CURRENCY_SYMBOL: Record<string, string> = {
    "India (INR)": "₹",
    "United States (USD)": "$",
    "Europe (EUR)": "€",
    "United Kingdom (GBP)": "£",
  };

  const SYMBOL_TO_CODE: Record<string, string> = {
    '₹': 'INR',
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP'
  };

  const REGION_TO_CODE: Record<string, string> = {
    'India (INR)': 'INR',
    'United States (USD)': 'USD',
    'Europe (EUR)': 'EUR',
    'United Kingdom (GBP)': 'GBP'
  };

  // Approximate conversion rates (for demo). Map from -> to multiplier.
  const CONVERSION_RATES: Record<string, Record<string, number>> = {
    INR: { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.009 },
    USD: { INR: 82.5, USD: 1, EUR: 0.92, GBP: 0.77 },
    EUR: { INR: 90, USD: 1.09, EUR: 1, GBP: 0.84 },
    GBP: { INR: 110, USD: 1.29, EUR: 1.19, GBP: 1 }
  };

  const LOCALES: Record<string, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB'
  };

  const detectSourceCurrency = (price: string) => {
    const symMatch = price.match(/[₹$€£]/);
    if (symMatch) return SYMBOL_TO_CODE[symMatch[0]] || REGION_TO_CODE[defaultRegion];
    // fallback: try to infer from default region
    return REGION_TO_CODE[defaultRegion] || 'INR';
  };

  const parseNumbers = (str: string) => {
    const matches = Array.from(str.matchAll(/([0-9][0-9,\.]*)/g));
    return matches.map(m => ({ raw: m[0], index: m.index || 0 }));
  };

  const convertPriceToRegion = (price: string, region: string, sourceRegion?: string) => {
    if (!price) return price;
    const targetCode = REGION_TO_CODE[region] || 'INR';
    const sourceCode = sourceRegion ? (REGION_TO_CODE[sourceRegion] || detectSourceCurrency(price)) : detectSourceCurrency(price);
    const rate = CONVERSION_RATES[sourceCode]?.[targetCode] ?? 1;

    const nums = parseNumbers(price);
    if (nums.length === 0) {
      // If no numeric parts, just replace symbols
      const symbol = CURRENCY_SYMBOL[region] || CURRENCY_SYMBOL['India (INR)'];
      return price.replace(/[₹$€£]/g, symbol);
    }

    let out = '';
    let lastPos = 0;
    for (let i = 0; i < nums.length; i++) {
      const { raw, index } = nums[i];
      const pos = price.indexOf(raw, lastPos);
      if (pos === -1) continue;
      // append text before number, but strip any trailing currency symbol
      let prefix = price.slice(lastPos, pos);
      prefix = prefix.replace(/[₹$€£]\s*$/g, '');
      out += prefix;
      // parse number
      const normalized = raw.replace(/,/g, '');
      const n = parseFloat(normalized);
      if (isNaN(n)) {
        out += raw;
        lastPos = pos + raw.length;
        continue;
      }
      const converted = n * rate;
      const locale = LOCALES[targetCode] || 'en-US';
      const fractionDigits = targetCode === 'INR' ? 0 : 2;
      const formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits }).format(converted);
      // attach currency symbol using symbol map
      const symbol = CURRENCY_SYMBOL[region] || CURRENCY_SYMBOL['India (INR)'];
      out += `${symbol}${formatted}`;
      lastPos = pos + raw.length;
    }
    // append remainder
    out += price.slice(lastPos);
    return out;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          const timer = setTimeout(() => {
            setIsSignedIn(true);
            fetchUserProfile(session.user);
          }, 0);
          return () => clearTimeout(timer);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        const timer = setTimeout(() => {
          if (session) {
            setIsSignedIn(true);
            fetchUserProfile(session.user);
          } else {
            setIsSignedIn(false);
            setCurrentUser(null);
          }
        }, 0);
        return () => clearTimeout(timer);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      const storedRegion = localStorage.getItem("defaultRegion");
      const storedModel = localStorage.getItem("defaultModel");
      const savedProfile = localStorage.getItem("userProfile");
      const storedNotifications = localStorage.getItem("notifications");
      const timer = setTimeout(() => {
        if (storedRegion) setDefaultRegion(storedRegion);
        if (storedModel) setDefaultModel(storedModel);
        if (storedNotifications) {
          try {
            setNotifications(JSON.parse(storedNotifications));
          } catch (e) {
            console.error("Failed to parse notifications", e);
          }
        }
        if (savedProfile) {
          try {
            const parsed = JSON.parse(savedProfile);
            setCurrentUser(parsed);
            setIsSignedIn(true);
          } catch (e) {
            console.error(e);
            setIsSignedIn(false);
          }
        } else {
          setIsSignedIn(false);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || supabase) return;
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!isSignedIn || supabase) {
      if (!isSignedIn) {
        const timer = setTimeout(() => {
          setCurrentUser(null);
        }, 0);
        return () => clearTimeout(timer);
      }
      return;
    }
    const timer = setTimeout(() => {
      const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null;
      if (savedProfile) {
        try {
          setCurrentUser(JSON.parse(savedProfile));
        } catch {}
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [isSignedIn]);

  // Synchronize settings (Supabase load or Local fallback)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (supabase && currentUser) {
      const loadSupabaseData = async () => {
        try {
          const { data: saved, error: savedErr } = await supabase
            .from("saved_recommendations")
            .select("*")
            .eq("user_id", currentUser.id);
          if (savedErr) throw savedErr;

          const mappedSaved = (saved || []).map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            estimatedPrice: r.estimated_price,
            whyItFits: r.why_it_fits,
            category: r.category,
            sparkOption: r.spark_option,
            matchScore: r.match_score,
            originalRegion: r.original_region
          }));

          const { data: profiles, error: profilesErr } = await supabase
            .from("recent_profiles")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: false })
            .limit(3);
          if (profilesErr) throw profilesErr;

          const mappedProfiles = (profiles || []).map(p => ({
            name: p.name,
            relationship: p.relationship,
            occasion: p.occasion,
            age: p.age,
            budget: p.budget,
            interests: p.interests || "",
            vibe: p.vibe || []
          }));

          const { data: notices, error: noticesErr } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: false })
            .limit(10);
          if (noticesErr) throw noticesErr;

          const mappedNotices = (notices || []).map(n => ({
            id: n.id,
            title: n.title,
            description: n.description,
            timestamp: new Date(n.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            read: n.read
          }));

          const { count, error: countErr } = await supabase
            .from("recent_profiles")
            .select("*", { count: "exact", head: true })
            .eq("user_id", currentUser.id);
          if (countErr) throw countErr;

          const timer = setTimeout(() => {
            setSavedRecommendations(mappedSaved.length > 0 ? mappedSaved : DEFAULT_SAVED);
            setRecentProfiles(mappedProfiles.length > 0 ? mappedProfiles : DEFAULT_PROFILES);
            setNotifications(mappedNotices.length > 0 ? mappedNotices : [
              {
                id: "demo-mode",
                title: "Live Cloud Database",
                description: "Authenticated securely. Loading your real-time cloud data.",
                timestamp: "Now",
                read: true,
              }
            ]);
            setTotalCurations(count || 3);
          }, 0);
          return () => clearTimeout(timer);
        } catch (err) {
          console.error("Error fetching data from Supabase:", err);
        }
      };
      loadSupabaseData();
    } else if (!supabase) {
      const suffix = currentUser ? `_${currentUser.email}` : "";
      const storedProfiles = localStorage.getItem(`recentProfiles${suffix}`);
      const storedSaved = localStorage.getItem(`savedRecommendations${suffix}`);
      const storedCurations = localStorage.getItem(`totalCurations${suffix}`);

      const timer = setTimeout(() => {
        if (storedProfiles) {
          try {
            setRecentProfiles(JSON.parse(storedProfiles));
          } catch {
            setRecentProfiles(DEFAULT_PROFILES);
          }
        } else {
          setRecentProfiles(DEFAULT_PROFILES);
        }

        if (storedSaved) {
          try {
            setSavedRecommendations(JSON.parse(storedSaved));
          } catch {
            setSavedRecommendations(DEFAULT_SAVED);
          }
        } else {
          setSavedRecommendations(DEFAULT_SAVED);
        }

        if (storedCurations) {
          setTotalCurations(parseInt(storedCurations, 10));
        } else {
          setTotalCurations(currentUser ? 3 : 14);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  // Persist user-specific details on changes (fallback only)
  useEffect(() => {
    if (typeof window === "undefined" || supabase) return;
    const suffix = currentUser ? `_${currentUser.email}` : "";
    localStorage.setItem(`recentProfiles${suffix}`, JSON.stringify(recentProfiles));
  }, [recentProfiles, currentUser]);

  useEffect(() => {
    if (typeof window === "undefined" || supabase) return;
    const suffix = currentUser ? `_${currentUser.email}` : "";
    localStorage.setItem(`savedRecommendations${suffix}`, JSON.stringify(savedRecommendations));
  }, [savedRecommendations, currentUser]);

  useEffect(() => {
    if (typeof window === "undefined" || supabase) return;
    const suffix = currentUser ? `_${currentUser.email}` : "";
    localStorage.setItem(`totalCurations${suffix}`, totalCurations.toString());
  }, [totalCurations, currentUser]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecentProfiles((prev) =>
        prev.map((profile) => ({
          ...profile,
          budget: convertBudgetToRegion(profile.budget, defaultRegion)
        }))
      );

      if (recipientInfo) {
        setRecipientInfo((current) => {
          if (!current) return null;
          return {
            ...current,
            budget: convertBudgetToRegion(current.budget, defaultRegion)
          };
        });
      }
      // update saved recommendations' price labels to match selected region
      setSavedRecommendations((prev) => prev.map((s) => ({
        ...s,
        estimatedPrice: convertPriceToRegion(s.estimatedPrice || "", defaultRegion, s.originalRegion)
      })));
      // update in-memory recommendations shown in results to match selected region
      setRecommendations((prev) => prev ? prev.map((r) => ({
        ...r,
        estimatedPrice: convertPriceToRegion(r.estimatedPrice || "", defaultRegion, r.originalRegion)
      })) : prev);
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultRegion]);

  useEffect(() => {
    let fadeTimer: NodeJS.Timeout;
    let removeTimer: NodeJS.Timeout;

    fadeTimer = setTimeout(() => {
      setFadeExit(true);
    }, 600);

    removeTimer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => {
      if (fadeTimer) clearTimeout(fadeTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, []);



  const handleSaveRecommendation = async (gift: GiftRecommendation) => {
    const alreadySaved = savedRecommendations.some(
      (item) => item.name.toLowerCase() === gift.name.toLowerCase()
    );
    if (!alreadySaved) {
      const score = gift.matchScore || 95;
      const newSaved = {
        ...gift,
        id: gift.id || `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        matchScore: score,
      };
      const converted = {
        ...newSaved,
        estimatedPrice: convertPriceToRegion(newSaved.estimatedPrice || "", defaultRegion, newSaved.originalRegion || defaultRegion),
        originalRegion: defaultRegion,
      };
      setSavedRecommendations([...savedRecommendations, converted]);
      addNotification("Gift saved", `"${gift.name}" was added to your Saved Ideas.`);

      if (supabase && currentUser) {
        try {
          await supabase
            .from("saved_recommendations")
            .insert([{
              user_id: currentUser.id,
              name: converted.name,
              description: converted.description,
              estimated_price: converted.estimatedPrice,
              why_it_fits: converted.whyItFits,
              category: converted.category,
              spark_option: converted.sparkOption || "",
              match_score: converted.matchScore,
              original_region: converted.originalRegion
            }]);
        } catch (err) {
          console.error("Failed to save to Supabase:", err);
        }
      }
    }
    setActiveTab("saved");
  };

  const handleRemoveSaved = async (giftIdOrName: string) => {
    setSavedRecommendations(
      savedRecommendations.filter(
        (item) => item.id !== giftIdOrName && item.name !== giftIdOrName
      )
    );

    if (supabase && currentUser) {
      try {
        const isUuid = giftIdOrName.length === 36;
        const query = supabase.from("saved_recommendations").delete().eq("user_id", currentUser.id);
        if (isUuid) {
          await query.eq("id", giftIdOrName);
        } else {
          await query.eq("name", giftIdOrName);
        }
      } catch (err) {
        console.error("Failed to delete from Supabase:", err);
      }
    }
  };

  const handleFormSubmit = async (formData: RecipientInfo) => {
    if (!isSignedIn) {
      setSignInModalOpen(true);
      return;
    }
    const budgetLabel = convertBudgetToRegion(formData.budget, defaultRegion);
    setIsLoading(true);
    setError(null);
    setRecipientInfo({ ...formData, budget: budgetLabel });
    addNotification("Curation started", `Finding perfect gifts for your ${formData.relationship} (${formData.occasion})…`);

    // Dynamic Recent Profiles Update
    const newProfile: RecentProfile = {
      name: formData.relationship,
      relationship: formData.relationship,
      occasion: formData.occasion,
      age: formData.age,
      budget: budgetLabel,
      interests: formData.interests || "General Passions",
      vibe: formData.vibe || []
    };
    setRecentProfiles((prev) => {
      const filtered = prev.filter(
        (p) =>
          !(
            p.name.toLowerCase() === newProfile.name.toLowerCase() &&
            p.occasion.toLowerCase() === newProfile.occasion.toLowerCase() &&
            p.age.toLowerCase() === newProfile.age.toLowerCase() &&
            p.budget === newProfile.budget
          )
      );
      return [newProfile, ...filtered].slice(0, 3);
    });

    if (supabase && currentUser) {
      try {
        const { error: profileErr } = await supabase
          .from("recent_profiles")
          .insert([{
            user_id: currentUser.id,
            name: newProfile.name,
            relationship: newProfile.relationship,
            occasion: newProfile.occasion,
            age: newProfile.age,
            budget: newProfile.budget,
            interests: newProfile.interests,
            vibe: newProfile.vibe
          }]);
        if (profileErr) throw profileErr;
      } catch (err) {
        console.error("Failed to save profile to Supabase:", err);
      }
    }

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, budget: budgetLabel }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recommendations. Please try again.");
      }

      const recs = (data.recommendations || []).map((r: any) => ({ ...r, originalRegion: defaultRegion }));
      setRecommendations(recs);
      setIsDemoMode(!!data.isDemoMode);
      setTotalCurations((prev) => prev + 1);
      addNotification(
        "Curation complete",
        `${recs.length} gift idea${recs.length !== 1 ? "s" : ""} ready for your ${formData.relationship}.`
      );
    } catch (err: any) {
      setError(err.message);
      setRecommendations(null);
      addNotification("Curation failed", err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadProfile = (profile: RecentProfile) => {
    setRecipientInfo({
      relationship: profile.name,
      age: profile.age,
      occasion: profile.occasion,
      interests: profile.interests,
      budget: profile.budget,
      vibe: profile.vibe || []
    });
    setActiveTab("generator");
    setRecentProfiles((prev) => {
      const filtered = prev.filter(
        (p) =>
          !(
            p.name.toLowerCase() === profile.name.toLowerCase() &&
            p.occasion.toLowerCase() === profile.occasion.toLowerCase() &&
            p.age.toLowerCase() === profile.age.toLowerCase() &&
            p.budget === profile.budget
          )
      );
      return [profile, ...filtered].slice(0, 3);
    });
  };

  const handleUpdateProfile = async (updatedProfile: any) => {
    if (supabase && currentUser) {
      try {
        const { error } = await supabase
          .from("user_profiles")
          .update({
            name: updatedProfile.name,
            email: updatedProfile.email
          })
          .eq("id", currentUser.id);
        if (error) throw error;
        setCurrentUser((prev: any) => ({ ...prev, ...updatedProfile }));
      } catch (err) {
        console.error("Failed to update profile in Supabase:", err);
        addNotification("Update failed", "Could not sync profile changes to database.");
        throw err;
      }
    } else {
      const newProfile = {
        ...currentUser,
        name: updatedProfile.name,
        email: updatedProfile.email,
        subscription: updatedProfile.subscription || "Gift Curator Pro",
        memberSince: updatedProfile.memberSince || "Recently",
      };
      localStorage.setItem("userProfile", JSON.stringify(newProfile));
      setCurrentUser(newProfile);
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Curator Dashboard";
      case "generator":
        return "AI Gift Curation";
      case "saved":
        return "Saved Ideas";
      case "settings":
        return "Curator Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <>
      {pageLoading && (
        <div className={`fixed inset-0 z-[9999] bg-[var(--background)] flex items-center justify-center transition-opacity duration-550 ease-out ${fadeExit ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <div className="relative flex flex-col items-center gap-6">
            <div className="absolute w-48 h-48 bg-violet-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-violet-500/10 border-t-violet-500 animate-spin" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-650 flex items-center justify-center text-white shadow-xl shadow-violet-900/30">
                <Gift size={28} className="animate-bounce" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-black text-2xl tracking-tight text-[var(--foreground)]">
                Wrappr<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">.AI</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-semibold tracking-widest uppercase animate-pulse">
                Initializing Curation Hub
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen overflow-hidden bg-[var(--background)] transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        onOpenSignIn={() => setSignInModalOpen(true)}
        addNotification={addNotification}
        onSignOut={() => {
          if (supabase) {
            supabase.auth.signOut();
          }
        }}
        currentUser={currentUser}
        curationsCount={totalCurations}
        savedCount={savedRecommendations.length}
        recipientsCount={recentProfiles.length}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={getHeaderTitle()}
          notifications={notifications}
          setNotifications={setNotifications}
          isDbDemoMode={!supabase}
        />

        {/* Content View */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8">

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner redone */}
              <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden border border-[var(--card-border)] bg-gradient-to-r from-violet-600/10 via-indigo-600/5 to-transparent">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="max-w-2xl space-y-3 relative z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest text-violet-500 bg-violet-500/10 border border-violet-500/20 uppercase">
                    Wrappr Curation Hub
                  </span>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-[var(--foreground)] tracking-tight leading-tight">
                    Find the Perfect Gift, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-500 to-rose-500">Every Single Time.</span>
                  </h2>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                    Unwrap highly customized, memorable recommendations engineered by AI. Analyze age milestones, occasion sentiments, relationship dynamics, and interests.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (!isSignedIn) {
                          setSignInModalOpen(true);
                        } else {
                          setRecipientInfo(null);
                          setActiveTab("generator");
                        }
                      }}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-lg shadow-violet-900/20 transition-all duration-200 cursor-pointer"
                    >
                      <Sparkles size={16} />
                      <span>Start New Curation</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: "Total Curations", value: `${totalCurations}`, icon: Gift, color: "text-violet-550 bg-violet-500/10 text-violet-500" },
                  { label: "Active Profiles", value: `${recentProfiles.length}`, icon: Users, color: "text-blue-550 bg-blue-500/10 text-blue-555 text-blue-500" },
                  { label: "Avg Match Score", value: getAvgMatchScore(), icon: TrendingUp, color: "text-emerald-555 bg-emerald-500/10 text-emerald-500" },
                  { label: "Saved Ideas", value: `${savedRecommendations.length}`, icon: Heart, color: "text-rose-555 bg-rose-500/10 text-rose-500" }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="glass-panel p-4 md:p-5 rounded-2xl border border-[var(--card-border)] flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] md:text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider block">
                          {stat.label}
                        </span>
                        <span className="text-lg md:text-xl font-black text-[var(--foreground)] mt-0.5 block">
                          {stat.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Cards row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profiles Shortcuts */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-base font-extrabold text-[var(--foreground)] tracking-tight">
                    Recent Recipient Profiles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recentProfiles.map((profile, i) => (
                      <div key={i} className="glass-panel p-4 rounded-xl border border-[var(--card-border)] flex flex-col justify-between hover:border-violet-500/30 transition-all duration-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-extrabold text-[var(--foreground)]">{profile.name}</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400">
                              {profile.occasion}
                            </span>
                          </div>
                          <div className="space-y-1 text-xs text-[var(--text-muted)]">
                            <p>Age Group: <span className="font-semibold text-[var(--foreground)]">{profile.age}</span></p>
                            <p>Budget: <span className="font-semibold text-[var(--foreground)]">{profile.budget}</span></p>
                          </div>
                        </div>
                        <div className="mt-4 pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-[10px] text-[var(--text-muted)] font-semibold">
                          <span className="truncate max-w-[100px]">Tags: {profile.interests}</span>
                          <button
                            onClick={() => handleLoadProfile(profile)}
                            className="text-violet-500 dark:text-violet-400 hover:underline cursor-pointer"
                          >
                            Load
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Knowledge Card */}
                <div className="glass-panel p-6 rounded-2xl border border-[var(--card-border)] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                      <BrainCircuit size={18} />
                    </div>
                    <h4 className="text-sm font-extrabold text-[var(--foreground)]">Smart Prompt Engine</h4>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Our platform structures descriptive instructions considering recipient relationship dynamics, budget rules, and passions to extract highly original recommendations.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[var(--card-border)] mt-4">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-violet-500 dark:text-violet-400 flex items-center gap-1 hover:underline"
                    >
                      <span>Read docs</span>
                      <ChevronRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Curation Generator Dashboard */}
          {activeTab === "generator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              <div className="lg:col-span-5 lg:sticky lg:top-4">
                <RecommendationGenerator
                  onSubmit={handleFormSubmit}
                  isLoading={isLoading}
                  initialData={recipientInfo}
                  region={defaultRegion}
                  budgetOptions={getBudgetOptions(defaultRegion)}
                />
              </div>

              <div className="lg:col-span-7 min-h-[400px]">
                <RecommendationResults
                  recommendations={recommendations}
                  isLoading={isLoading}
                  error={error}
                  isDemoMode={isDemoMode}
                  recipientInfo={recipientInfo}
                  onSaveGift={handleSaveRecommendation}
                  savedIds={savedRecommendations.map((item) => item.id || item.name)}
                />
              </div>
            </div>
          )}

          {/* TAB 3: SAVED IDEAS */}
          {activeTab === "saved" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-[var(--foreground)] tracking-tight flex items-center gap-2">
                  <Heart size={22} className="text-rose-500" />
                  Your Saved Recommendations
                </h2>
                <p className="text-[var(--text-muted)] text-xs md:text-sm">
                  Review recommendations bookmarked in your logs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedRecommendations.map((rec, idx) => (
                  <GiftCard
                    key={rec.id || idx}
                    recommendation={rec}
                    index={idx}
                    isSavedPage={true}
                    onRemove={() => handleRemoveSaved(rec.id || rec.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
                  Curator Hub Settings
                </h2>
                <p className="text-[var(--text-muted)] text-xs md:text-sm">
                  Configure defaults, parameters, and API options.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-[var(--card-border)] space-y-6">
                <h3 className="text-sm font-bold text-[var(--foreground)] border-b border-[var(--card-border)] pb-2 uppercase tracking-wider">
                  OpenAI API Key Integration
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--foreground)] block">
                      OPENAI_API_KEY
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••••••••••••••••••••••••••••••"
                      disabled
                      className="w-full glass-input rounded-xl px-4 py-3 text-xs opacity-60 cursor-not-allowed select-none"
                    />
                    <p className="text-[10px] text-[var(--text-muted)] flex items-start gap-1">
                      <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
                      <span>API credentials are loaded securely from <code>.env.local</code> in the workspace root. Currently running in <strong>Demo Fallback Mode</strong>.</span>
                    </p>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[var(--foreground)] border-b border-[var(--card-border)] pb-2 uppercase tracking-wider pt-4">
                  Default Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--foreground)] block">
                      Default Recipient Region
                    </label>
                    <select
                      aria-label="Default Recipient Region"
                      value={defaultRegion}
                      onChange={(e) => setDefaultRegion(e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-3 text-xs cursor-pointer"
                    >
                      <option className="bg-slate-900">India (INR)</option>
                      <option className="bg-slate-900">United States (USD)</option>
                      <option className="bg-slate-900">Europe (EUR)</option>
                      <option className="bg-slate-900">United Kingdom (GBP)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--foreground)] block">
                      Default AI Model
                    </label>
                    <select
                      aria-label="Default AI Model"
                      value={defaultModel}
                      onChange={(e) => setDefaultModel(e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-3 text-xs cursor-pointer"
                    >
                      <option className="bg-slate-900">gpt-4o-mini (Recommended)</option>
                      <option className="bg-slate-900">gpt-4o (High-fidelity)</option>
                      <option className="bg-slate-900">Local Rule Curation (Demo)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--card-border)] flex flex-col gap-3 sm:items-end">
                  {settingsSaved && (
                    <p className="text-xs text-emerald-400">Settings saved locally and will remain active on refresh.</p>
                  )}
                  <button
                    onClick={() => {
                      localStorage.setItem("defaultRegion", defaultRegion);
                      localStorage.setItem("defaultModel", defaultModel);
                      setSettingsSaved(true);
                      addNotification("Settings saved", `Defaults updated to ${defaultRegion} using ${defaultModel.split(" ")[0]}.`);
                      setTimeout(() => setSettingsSaved(false), 3000);
                    }}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                    type="button"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Global sticky footer info bar */}
        <footer className="py-4 px-6 border-t border-[var(--sidebar-border)] bg-black/5 text-center text-[10px] text-[var(--text-muted)] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Wrappr.AI Curation Hub. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with ❤️ for thoughtful givers.
          </p>
        </footer>
      </div>
    </div>
      {/* Sign In / Sign Up Modal — rendered at root level to escape sidebar stacking context */}
      {signInModalOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl overflow-hidden">
            {/* Header / Tabs */}
            <div className="bg-gradient-to-r from-violet-600/20 to-rose-600/20 border-b border-[var(--card-border)] px-6 pt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  {signInTab === "signin" ? "Sign In to Wrappr.AI" : "Create Curator Account"}
                </h2>
                <button
                  onClick={() => {
                    setSignInModalOpen(false);
                    setAuthError(null);
                    setAuthPassword("");
                  }}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                  aria-label="Close auth modal"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              
              {supabase && (
                <div className="flex border-b border-white/5 mt-2 text-sm">
                  <button
                    type="button"
                    onClick={() => { setSignInTab("signin"); setAuthError(null); }}
                    className={`flex-1 pb-2 font-semibold text-center border-b-2 transition-all cursor-pointer ${
                      signInTab === "signin"
                        ? "border-violet-500 text-violet-400"
                        : "border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSignInTab("signup"); setAuthError(null); }}
                    className={`flex-1 pb-2 font-semibold text-center border-b-2 transition-all cursor-pointer ${
                      signInTab === "signup"
                        ? "border-violet-500 text-violet-400"
                        : "border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={signInTab === "signin" ? handleSignIn : handleSignUp}>
              <div className="px-6 py-6 space-y-4">
                {authError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-medium">
                    {authError}
                  </div>
                )}

                {/* Name - only on Sign Up or when in Local Storage fallback mode */}
                {(signInTab === "signup" || !supabase) && (
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Full Name</label>
                    <input
                      type="text"
                      value={signInData.name}
                      onChange={(e) => setSignInData({ ...signInData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-[var(--sidebar-bg)] border border-[var(--input-border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-violet-500 transition-colors duration-150 text-sm"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Email Address</label>
                  <input
                    type="email"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[var(--sidebar-bg)] border border-[var(--input-border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-violet-500 transition-colors duration-150 text-sm"
                    placeholder="e.g. name@gmail.com"
                  />
                </div>

                {supabase ? (
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Password</label>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 bg-[var(--sidebar-bg)] border border-[var(--input-border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-violet-500 transition-colors duration-150 text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg font-medium leading-relaxed">
                      ⚠️ Supabase integration is currently in Local Storage fallback demo mode because env credentials are not configured. Password is not required.
                    </p>
                  </div>
                )}

                {signInTab === "signup" && (
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Subscription Tier</label>
                    <div className="w-full px-3 py-2 bg-[var(--sidebar-bg)] border border-[var(--input-border)] rounded-lg text-sm flex items-center justify-between cursor-not-allowed opacity-75">
                      <span className="text-[var(--foreground)] font-medium">Gift Curator Pro</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">Default</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="border-t border-[var(--card-border)] px-6 py-4 flex gap-3">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-750 disabled:opacity-50 text-white rounded-lg transition-colors duration-150 font-semibold text-sm cursor-pointer"
                >
                  {authLoading ? "Authenticating..." : (signInTab === "signin" ? "Authenticate" : "Create Account")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignInModalOpen(false);
                    setAuthError(null);
                    setAuthPassword("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg transition-colors duration-150 font-semibold text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
