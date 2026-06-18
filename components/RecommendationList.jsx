"use client";

import { Sparkles, Gift, AlertCircle, Info } from "lucide-react";
import GiftCard from "./GiftCard";

export default function RecommendationList({ 
  recommendations, 
  isLoading, 
  error, 
  isDemoMode,
  recipientInfo
}) {
  
  // 1. Loading State (Skeletons)
  if (isLoading) {
    return (
      <div className="space-y-6 w-full animate-pulse">
        <div className="h-6 w-48 bg-gray-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel border border-white/5 rounded-2xl p-6 h-[380px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 bg-gray-800 rounded-xl" />
                    <div className="w-16 h-4 bg-gray-800 rounded-full" />
                  </div>
                  <div className="w-12 h-6 bg-gray-800 rounded-lg" />
                </div>
                <div className="h-6 w-3/4 bg-gray-800 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-800 rounded-lg" />
                  <div className="h-4 w-full bg-gray-800 rounded-lg" />
                  <div className="h-4 w-2/3 bg-gray-800 rounded-lg" />
                </div>
                <div className="h-16 w-full bg-gray-850 rounded-xl" />
              </div>
              <div className="h-10 w-full bg-gray-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="glass-panel border border-rose-500/20 bg-rose-500/5 rounded-2xl p-6 md:p-8 text-center space-y-4 max-w-2xl mx-auto animate-fade-in">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
          <AlertCircle size={28} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">Recommendation Failed</h3>
          <p className="text-gray-300 text-sm max-w-md mx-auto">
            {error || "An unexpected error occurred while fetching your gift ideas. Please check your network or try again."}
          </p>
        </div>
      </div>
    );
  }

  // 3. Idle / Welcome State (Before Submission)
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="glass-panel border border-white/5 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="relative mx-auto w-20 h-20 bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 rounded-2xl flex items-center justify-center text-violet-400 shadow-[0_0_50px_rgba(139,92,246,0.1)] border border-violet-500/10">
          <Gift size={40} className="animate-float" />
          <Sparkles size={16} className="absolute -top-1 -right-1 text-indigo-400 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">Your Gift Ideas will appear here</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Fill out the form above with recipient characteristics, interests, and budget to let our AI curate customized, memorable gift suggestions.
          </p>
        </div>

        {/* Minimal aesthetic grid outline preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 opacity-30 select-none pointer-events-none">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-dashed border-white/20 rounded-xl p-4 h-24 flex items-center justify-center text-xs text-gray-500">
              Gift Idea #{n}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. Results State
  return (
    <div className="space-y-6 w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles size={22} className="text-violet-400" />
            Curated Gift Ideas for Your {recipientInfo?.relationship || "Recipient"}
          </h2>
          <p className="text-gray-400 text-xs md:text-sm">
            Tailored suggestions matching their {recipientInfo?.age?.toLowerCase()} lifestyle and {recipientInfo?.occasion?.toLowerCase()} occasion.
          </p>
        </div>
        
        {isDemoMode && (
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-xs text-indigo-300 self-start sm:self-center">
            <Info size={14} className="flex-shrink-0" />
            <span>Demo Mode Active</span>
          </div>
        )}
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec, idx) => (
          <GiftCard 
            key={rec.id || `gift-${idx}`} 
            recommendation={rec} 
            index={idx}
          />
        ))}
      </div>

      {/* Demo Banner Helper info */}
      {isDemoMode && (
        <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-4 text-xs text-gray-400 flex items-start gap-2.5 max-w-3xl mx-auto">
          <Info size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Want live AI recommendations?</strong> Add your <code>OPENAI_API_KEY</code> to a file named <code>.env.local</code> inside the root directory and restart the development server. The app will automatically detect it and transition to using live GPT-4o-mini completions!
          </p>
        </div>
      )}
    </div>
  );
}
