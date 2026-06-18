"use client";

import { Sparkles, Gift, AlertCircle, Info } from "lucide-react";
import GiftCard from "./GiftCard";

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

interface RecipientInfo {
  relationship: string;
  age: string;
  occasion: string;
  interests: string;
  budget: string;
  vibe: string[];
}

interface ResultsProps {
  recommendations: GiftRecommendation[] | null;
  isLoading: boolean;
  error: string | null;
  isDemoMode: boolean;
  recipientInfo: RecipientInfo | null;
  onSaveGift?: (gift: GiftRecommendation) => void;
  savedIds?: string[];
}

export default function RecommendationResults({ 
  recommendations, 
  isLoading, 
  error, 
  isDemoMode,
  recipientInfo,
  onSaveGift,
  savedIds = []
}: ResultsProps) {
  
  // 1. Loading State (Skeletons)
  if (isLoading) {
    return (
      <div className="space-y-6 w-full animate-pulse">
        <div className="h-6 w-48 bg-[var(--input-bg)] rounded-lg border border-[var(--input-border)]" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel border border-[var(--card-border)] rounded-2xl p-5 h-[480px] flex flex-col justify-between">
              <div className="space-y-4">
                {/* Image box placeholder skeleton */}
                <div className="h-40 w-full bg-[var(--input-bg)] rounded-xl border border-[var(--input-border)]" />
                <div className="flex justify-between items-center">
                  <div className="w-16 h-4 bg-[var(--input-bg)] rounded-full border border-[var(--input-border)]" />
                  <div className="w-20 h-4 bg-[var(--input-bg)] rounded-full border border-[var(--input-border)]" />
                </div>
                <div className="h-6 w-3/4 bg-[var(--input-bg)] rounded-lg border border-[var(--input-border)]" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-[var(--input-bg)] rounded-lg border border-[var(--input-border)]" />
                  <div className="h-3 w-full bg-[var(--input-bg)] rounded-lg border border-[var(--input-border)]" />
                  <div className="h-3 w-2/3 bg-[var(--input-bg)] rounded-lg border border-[var(--input-border)]" />
                </div>
                <div className="h-14 w-full bg-[var(--input-bg)] rounded-xl border border-[var(--input-border)]" />
              </div>
              <div className="h-10 w-full bg-[var(--input-bg)] rounded-xl border border-[var(--input-border)]" />
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
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
          <AlertCircle size={28} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[var(--foreground)]">Curation Failed</h3>
          <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
            {error || "An unexpected error occurred while fetching your gift ideas. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  // 3. Idle / Welcome State (Before Submission)
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="glass-panel border border-[var(--card-border)] rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="relative mx-auto w-20 h-20 bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 rounded-2xl flex items-center justify-center text-violet-500 shadow-[0_0_50px_rgba(139,92,246,0.1)] border border-violet-500/10">
          <Gift size={40} className="animate-float text-violet-500" />
          <Sparkles size={16} className="absolute -top-1 -right-1 text-indigo-400 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight">Your Gift Ideas will appear here</h3>
          <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto leading-relaxed">
            Specify the occasion, age group, relationship, budget range, and hobbies using the generator panel to unwrap highly tailored gift concepts.
          </p>
        </div>

        {/* Dash preview cards outline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 opacity-30 select-none pointer-events-none">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-dashed border-[var(--card-border)] rounded-xl p-4 h-24 flex items-center justify-center text-xs text-[var(--text-muted)] font-semibold">
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
          <h2 className="text-xl md:text-2xl font-extrabold text-[var(--foreground)] tracking-tight flex items-center gap-2">
            <Sparkles size={22} className="text-violet-500" />
            Curated Gift Suggestions
          </h2>
          <p className="text-[var(--text-muted)] text-xs md:text-sm">
            Custom recommendations matching the profile of your <span className="font-bold text-violet-600 dark:text-violet-400">{recipientInfo?.relationship || "Recipient"}</span> for their <span className="font-bold text-violet-600 dark:text-violet-400">{recipientInfo?.occasion || "Special Occasion"}</span>.
          </p>
        </div>
        
        {isDemoMode && (
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-xs text-indigo-600 dark:text-indigo-300 self-start sm:self-center">
            <Info size={14} className="flex-shrink-0" />
            <span>Mock Mode</span>
          </div>
        )}
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendations.map((rec, idx) => {
          const isSaved = savedIds.includes(rec.id || rec.name);
          return (
            <GiftCard 
              key={rec.id || `gift-${idx}`} 
              recommendation={rec} 
              index={idx}
              isSaved={isSaved}
              onSave={onSaveGift}
            />
          );
        })}
      </div>
    </div>
  );
}
