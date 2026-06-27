"use client";

import { useState } from "react";
import { 
  Laptop, 
  Coffee, 
  Compass, 
  PenTool, 
  Flame, 
  Gift, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Heart,
  Palette,
  BookOpen
} from "lucide-react";
import { getGoogleSearchUrl } from "@/lib/utils";
import { resolveGiftImage } from "@/lib/giftImages";

// Helper to resolve appropriate icon & color based on category string
const getCategoryDetails = (category = "") => {
  const cat = category.toLowerCase();
  
  if (cat.includes("tech") || cat.includes("gaming") || cat.includes("gadget")) {
    return {
      icon: Laptop,
      colorClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      iconContainer: "bg-blue-500/20 text-blue-300"
    };
  }
  if (cat.includes("cozy") || cat.includes("wellness") || cat.includes("relaxation") || cat.includes("spa")) {
    return {
      icon: Coffee,
      colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      iconContainer: "bg-emerald-500/20 text-emerald-300"
    };
  }
  if (cat.includes("adventure") || cat.includes("outdoor") || cat.includes("travel") || cat.includes("camping")) {
    return {
      icon: Compass,
      colorClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      iconContainer: "bg-amber-500/20 text-amber-300"
    };
  }
  if (cat.includes("creative") || cat.includes("stationary") || cat.includes("art") || cat.includes("diy")) {
    return {
      icon: Palette,
      colorClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      iconContainer: "bg-purple-500/20 text-purple-300"
    };
  }
  if (cat.includes("culinary") || cat.includes("food") || cat.includes("cooking") || cat.includes("spicy")) {
    return {
      icon: Flame,
      colorClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      iconContainer: "bg-rose-500/20 text-rose-300"
    };
  }
  if (cat.includes("book") || cat.includes("reading") || cat.includes("journal")) {
    return {
      icon: BookOpen,
      colorClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      iconContainer: "bg-indigo-500/20 text-indigo-300"
    };
  }
  if (cat.includes("sentimental") || cat.includes("love") || cat.includes("fashion")) {
    return {
      icon: Heart,
      colorClass: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      iconContainer: "bg-pink-500/20 text-pink-300"
    };
  }

  return {
    icon: Gift,
    colorClass: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    iconContainer: "bg-violet-500/20 text-violet-300"
  };
};

export default function GiftCard({ recommendation, index }) {
  const [isSparkExpanded, setIsSparkExpanded] = useState(false);
  
  const { 
    name, 
    description, 
    estimatedPrice, 
    whyItFits, 
    category, 
    sparkOption 
  } = recommendation;

  const { icon: CategoryIcon, colorClass, iconContainer } = getCategoryDetails(category);

  return (
    <div 
      className="glow-card glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full group border border-white/5 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Dynamic light streak on card hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div>
        {/* Gift Image */}
        <div className="relative w-full h-40 rounded-xl mb-4 overflow-hidden border border-white/5 bg-gray-900/50">
          <img 
            src={resolveGiftImage(name, category)} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Top Header Grid */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${iconContainer} transition-transform duration-300 group-hover:scale-110`}>
              <CategoryIcon size={20} />
            </div>
            <div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border uppercase ${colorClass}`}>
                {category || "Gift Idea"}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-800/80 border border-white/5 px-3 py-1 rounded-xl text-xs font-bold text-violet-300">
            {estimatedPrice}
          </div>
        </div>

        {/* Gift Name */}
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-violet-300 transition-colors duration-200">
          {name}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Why it fits */}
        <div className="bg-white/2 rounded-xl p-3 border border-white/5 mb-4">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles size={10} className="text-violet-400" />
            Why it fits perfectly
          </h4>
          <p className="text-gray-300 text-xs leading-relaxed italic">
            &ldquo;{whyItFits}&rdquo;
          </p>
        </div>
      </div>

      {/* Footer and Interactive Collapsible Spark Twist */}
      <div className="mt-auto pt-2 space-y-3">
        {sparkOption && (
          <div className="border-t border-white/5 pt-3">
            <button
              onClick={() => setIsSparkExpanded(!isSparkExpanded)}
              className="flex items-center justify-between w-full text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                🪄 Add a Presentation Spark
              </span>
              {isSparkExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            {isSparkExpanded && (
              <div className="mt-2 text-xs text-gray-300 leading-relaxed bg-violet-950/20 border border-violet-900/30 rounded-xl p-3 animate-fade-in">
                {sparkOption}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <a
            href={getGoogleSearchUrl(name)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-xs font-medium bg-gray-800 hover:bg-gray-750 text-white py-2.5 rounded-xl border border-white/5 transition-all duration-200"
          >
            <span>Search on Google</span>
            <ExternalLink size={12} className="text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
