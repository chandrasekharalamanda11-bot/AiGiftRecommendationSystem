"use client";

import { useState } from "react";
import { 
  Laptop, 
  Coffee, 
  Compass, 
  Flame, 
  Gift, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Palette,
  BookOpen,
  Heart
} from "lucide-react";
import { getGoogleSearchUrl } from "@/lib/utils";

interface GiftRecommendation {
  id?: string;
  name: string;
  description: string;
  estimatedPrice: string;
  whyItFits: string;
  category: string;
  sparkOption?: string;
  matchScore?: number;
}

interface GiftCardProps {
  recommendation: GiftRecommendation;
  index: number;
  isSaved?: boolean;
  isSavedPage?: boolean;
  onSave?: (gift: GiftRecommendation) => void;
  onRemove?: () => void;
}

// Category details resolver
const getCategoryDetails = (category = "") => {
  const cat = category.toLowerCase();
  
  if (cat.includes("tech") || cat.includes("gaming") || cat.includes("gadget")) {
    return {
      icon: Laptop,
      colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      iconContainer: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
      gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
      svgPattern: (
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tech-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-grid)" className="text-blue-500" />
          <circle cx="80%" cy="30%" r="40" className="fill-blue-500/20 blur-md" />
        </svg>
      )
    };
  }
  if (cat.includes("cozy") || cat.includes("wellness") || cat.includes("relaxation") || cat.includes("spa")) {
    return {
      icon: Coffee,
      colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      iconContainer: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
      gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
      svgPattern: (
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" r="50" className="stroke-emerald-500/20 stroke-1 fill-none animate-pulse" />
          <circle cx="50%" cy="50%" r="30" className="stroke-emerald-500/10 stroke-1 fill-none" />
          <circle cx="20%" cy="80%" r="35" className="fill-emerald-500/10 blur-lg" />
        </svg>
      )
    };
  }
  if (cat.includes("adventure") || cat.includes("outdoor") || cat.includes("travel") || cat.includes("camping")) {
    return {
      icon: Compass,
      colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      iconContainer: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
      gradient: "from-amber-600/20 via-orange-600/10 to-transparent",
      svgPattern: (
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2="100%" y2="100%" className="stroke-amber-500/10 stroke-1" />
          <line x1="100%" y1="0" x2="0" y2="100%" className="stroke-amber-500/10 stroke-1" />
          <circle cx="50%" cy="50%" r="40" className="stroke-amber-500/20 stroke-2 fill-none" />
          <circle cx="50%" cy="50%" r="8" className="fill-amber-500/30" />
        </svg>
      )
    };
  }
  if (cat.includes("creative") || cat.includes("stationary") || cat.includes("art") || cat.includes("diy")) {
    return {
      icon: Palette,
      colorClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      iconContainer: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
      gradient: "from-purple-600/20 via-pink-600/10 to-transparent",
      svgPattern: (
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 80 Q 52.5 10, 95 80 T 180 80" fill="none" className="stroke-purple-500/20 stroke-2" />
          <path d="M10 50 Q 70 90, 130 20 T 200 60" fill="none" className="stroke-purple-500/10 stroke-1" />
          <circle cx="30%" cy="40%" r="25" className="fill-purple-500/20 blur-md" />
        </svg>
      )
    };
  }
  if (cat.includes("culinary") || cat.includes("food") || cat.includes("cooking") || cat.includes("spicy")) {
    return {
      icon: Flame,
      colorClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      iconContainer: "bg-rose-500/20 text-rose-700 dark:text-rose-300",
      gradient: "from-rose-600/20 via-red-600/10 to-transparent",
      svgPattern: (
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50%" cy="60%" rx="40" ry="20" className="fill-rose-500/15 blur-md" />
          <circle cx="55%" cy="40%" r="15" className="fill-orange-500/25 blur-md" />
        </svg>
      )
    };
  }
  if (cat.includes("book") || cat.includes("reading") || cat.includes("journal")) {
    return {
      icon: BookOpen,
      colorClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      iconContainer: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300",
      gradient: "from-indigo-600/20 via-blue-600/10 to-transparent",
      svgPattern: (
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <rect x="20%" y="20%" width="60%" height="60%" rx="4" className="stroke-indigo-500/10 stroke-1 fill-none" />
          <line x1="50%" y1="20%" x2="50%" y2="80%" className="stroke-indigo-500/20 stroke-1" />
          <circle cx="70%" cy="30%" r="20" className="fill-indigo-500/10 blur-sm" />
        </svg>
      )
    };
  }

  return {
    icon: Gift,
    colorClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    iconContainer: "bg-violet-500/20 text-violet-700 dark:text-violet-300",
    gradient: "from-violet-600/20 via-fuchsia-600/10 to-transparent",
    svgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        <rect x="30%" y="30%" width="40%" height="40%" rx="8" className="stroke-violet-500/20 stroke-2 fill-none" />
        <line x1="50%" y1="30%" x2="50%" y2="70%" className="stroke-violet-500/30 stroke-1" />
        <line x1="30%" y1="50%" x2="70%" y2="50%" className="stroke-violet-500/30 stroke-1" />
        <circle cx="50%" cy="25%" r="10" className="stroke-violet-500/20 stroke-2 fill-none" />
      </svg>
    )
  };
};

// Deterministic score generator based on product name to keep render pure
const getDeterministicScore = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 85 + (Math.abs(hash) % 15);
};

export default function GiftCard({ 
  recommendation, 
  index, 
  isSaved = false, 
  isSavedPage = false, 
  onSave, 
  onRemove 
}: GiftCardProps) {
  const [isSparkExpanded, setIsSparkExpanded] = useState(false);
  
  const { 
    name, 
    description, 
    estimatedPrice, 
    whyItFits, 
    category, 
    sparkOption,
    matchScore: propMatchScore
  } = recommendation;

  const matchScore = propMatchScore || getDeterministicScore(name);

  const { icon: CategoryIcon, colorClass, iconContainer, gradient, svgPattern } = getCategoryDetails(category);

  return (
    <div 
      className="glow-card glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-full group animate-fade-in-up transition-colors duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Light glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div>
        {/* Gift Image Placeholder */}
        <div className={`relative w-full h-40 rounded-xl mb-4 overflow-hidden bg-gradient-to-b ${gradient} flex items-center justify-center border border-[var(--card-border)]`}>
          {svgPattern}
          <div className="z-10 flex flex-col items-center gap-2">
            <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg text-[var(--foreground)]`}>
              <CategoryIcon size={24} />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
              {category || "Gift Curation"}
            </span>
          </div>
        </div>

        {/* Match score & category tag row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide border uppercase ${colorClass}`}>
              {category || "Gift"}
            </span>
          </div>
          {/* Match Score */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shadow-sm">
            <Sparkles size={8} className="animate-pulse text-emerald-500" />
            <span>{matchScore}% Match</span>
          </div>
        </div>

        {/* Gift Name */}
        <h3 className="text-base font-extrabold text-[var(--foreground)] mb-1.5 tracking-tight group-hover:text-violet-500 dark:group-hover:text-violet-300 transition-colors duration-200">
          {name}
        </h3>

        {/* Description */}
        <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-3.5">
          {description}
        </p>

        {/* Price and explanation */}
        <div className="space-y-2.5">
          {/* Price */}
          <div className="flex justify-between items-center text-xs py-1.5 px-3 rounded-lg bg-black/5 dark:bg-white/2 border border-[var(--card-border)]">
            <span className="text-[var(--text-muted)] font-medium">Estimated Price</span>
            <span className="font-extrabold text-violet-600 dark:text-violet-400">{estimatedPrice}</span>
          </div>

          {/* AI Explanation */}
          <div className="bg-white/5 dark:bg-white/2 rounded-xl p-3 border border-[var(--card-border)]">
            <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles size={10} className="text-violet-500" />
              AI Explanation
            </h4>
            <p className="text-[var(--foreground)] text-xs leading-relaxed italic opacity-90">
              &ldquo;{whyItFits}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Presentation suggestion / Personalization */}
      <div className="mt-4 pt-3 border-t border-[var(--card-border)] space-y-3">
        {sparkOption && (
          <div>
            <button
              onClick={() => setIsSparkExpanded(!isSparkExpanded)}
              className="flex items-center justify-between w-full text-xs font-bold text-violet-500 dark:text-violet-400 hover:text-violet-600 dark:hover:text-violet-300 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                🪄 Personalization Suggestion
              </span>
              {isSparkExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            {isSparkExpanded && (
              <div className="mt-2 text-xs text-[var(--foreground)] leading-relaxed bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 animate-fade-in">
                {sparkOption}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <a
            href={getGoogleSearchUrl(name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold bg-[var(--input-bg)] hover:bg-black/5 text-[var(--foreground)] py-2.5 rounded-xl border border-[var(--input-border)] transition-all duration-200 cursor-pointer"
          >
            <span>Search options</span>
            <ExternalLink size={12} className="opacity-60" />
          </a>

          {isSavedPage ? (
            <button
              onClick={onRemove}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
              title="Remove Saved Idea"
            >
              <Heart size={14} fill="currentColor" className="text-rose-500" />
              <span>Saved</span>
            </button>
          ) : onSave ? (
            <button
              onClick={() => onSave(recommendation)}
              disabled={isSaved}
              className={`flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSaved
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 cursor-default"
                  : "bg-violet-600 hover:bg-violet-500 text-white border-violet-600 hover:border-violet-500 shadow-md shadow-violet-900/10"
              }`}
              title={isSaved ? "Saved to Ideas" : "Save to Ideas"}
            >
              <Heart size={14} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-emerald-500" : "text-white"} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
