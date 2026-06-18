"use client";

import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Smile,
  Heart,
  Gift,
  DollarSign,
  Tag,
  Sparkles
} from "lucide-react";
import React from "react";

interface GeneratorProps {
  onSubmit: (data: {
    relationship: string;
    age: string;
    occasion: string;
    interests: string;
    budget: string;
    vibe: string[];
  }) => void;
  isLoading: boolean;
  initialData?: {
    relationship: string;
    age: string;
    occasion: string;
    interests: string;
    budget: string;
    vibe: string[];
  } | null;
  region?: string;
  budgetOptions?: string[];
}

const RELATIONSHIPS = [
  "Partner", "Spouse", "Parent", "Child", "Sibling", "Friend",
  "Colleague", "Boss", "Teacher / Mentor", "Other"
];

const OCCASIONS = [
  "Birthday", "Anniversary", "Christmas / Holidays", "Valentine's Day",
  "Graduation", "Housewarming", "Mother's Day", "Father's Day",
  "Thank You", "Just Because"
];

const AGE_GROUPS = [
  { label: "Kid (0-12)", value: "Kid" },
  { label: "Teen (13-19)", value: "Teen" },
  { label: "Young Adult (20-29)", value: "Young Adult" },
  { label: "Adult (30-59)", value: "Adult" },
  { label: "Senior (60+)", value: "Senior" }
];

const BUDGETS = ["Under 500", "500-1000", "1000-2000", "2000-5000", "5000+"];

const VIBE_TAGS = [
  "Cozy", "Techie", "Practical", "Creative",
  "Adventurous", "Sentimental", "Trendy", "Luxurious"
];

export default function RecommendationGenerator({ 
  onSubmit, 
  isLoading, 
  initialData,
  region = "India (INR)",
  budgetOptions = BUDGETS
}: GeneratorProps) {
  const [relation, setRelation] = useState(initialData?.relationship || "");
  const [age, setAge] = useState(initialData?.age || "");
  const [occasion, setOccasion] = useState(initialData?.occasion || "");
  const [interests, setInterests] = useState(initialData?.interests || "");
  const [budget, setBudget] = useState(initialData?.budget || budgetOptions[2] || budgetOptions[0] || "");
  const [selectedVibes, setSelectedVibes] = useState<string[]>(initialData?.vibe || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      if (initialData) {
        setRelation(initialData.relationship || "");
        setAge(initialData.age || "");
        setOccasion(initialData.occasion || "");
        setInterests(initialData.interests || "");
        setBudget(initialData.budget || budgetOptions[2] || budgetOptions[0] || "");
        setSelectedVibes(initialData.vibe || []);
      } else {
        // Clear form when initialData is null (start new curation)
        setRelation("");
        setAge("");
        setOccasion("");
        setInterests("");
        setBudget(budgetOptions[2] || budgetOptions[0] || "");
        setSelectedVibes([]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [initialData, budgetOptions]);

  const handleVibeToggle = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
    } else {
      if (selectedVibes.length < 3) {
        setSelectedVibes([...selectedVibes, vibe]);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!relation) newErrors.relation = "Please select a relation";
    if (!age) newErrors.age = "Please select an age group";
    if (!occasion) newErrors.occasion = "Please select an occasion";
    if (!budget) newErrors.budget = "Please select a budget range";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!budgetOptions.includes(budget)) {
        setBudget(budgetOptions[2] || "");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [budgetOptions, budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      relationship: relation,
      age,
      occasion,
      interests,
      budget,
      vibe: selectedVibes
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden border border-[var(--card-border)] w-full animate-fade-in-up"
    >
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight flex items-center gap-2">
            <Sparkles size={20} className="text-violet-500 animate-pulse" />
            Curate Gift Suggestions
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Specify the recipient profile details below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Relation Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
              <User size={16} className="text-violet-500" />
              Relation
            </label>
            <div className="relative">
              <select
                value={relation}
                onChange={(e) => {
                  setRelation(e.target.value);
                  if (errors.relation) setErrors({ ...errors, relation: "" });
                }}
                className={`w-full glass-input rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500/20 ${errors.relation ? "border-rose-500/50 focus:border-rose-500" : ""
                  }`}
              >
                <option value="" disabled className="bg-slate-900 text-gray-400">Select relation...</option>
                {RELATIONSHIPS.map((rel) => (
                  <option key={rel} value={rel} className="bg-slate-950 text-[var(--foreground)]">
                    {rel}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-455">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.relation && (
              <span className="text-xs text-rose-455 text-red-500 dark:text-rose-400 font-medium pl-1">{errors.relation}</span>
            )}
          </div>

          {/* Occasion Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
              <Calendar size={16} className="text-violet-500" />
              Occasion
            </label>
            <div className="relative">
              <select
                value={occasion}
                onChange={(e) => {
                  setOccasion(e.target.value);
                  if (errors.occasion) setErrors({ ...errors, occasion: "" });
                }}
                className={`w-full glass-input rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500/20 ${errors.occasion ? "border-rose-500/50 focus:border-rose-500" : ""
                  }`}
              >
                <option value="" disabled className="bg-slate-900 text-gray-400">Select occasion...</option>
                {OCCASIONS.map((occ) => (
                  <option key={occ} value={occ} className="bg-slate-950 text-[var(--foreground)]">
                    {occ}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-455">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.occasion && (
              <span className="text-xs text-rose-455 text-red-500 dark:text-rose-400 font-medium pl-1">{errors.occasion}</span>
            )}
          </div>
        </div>

        {/* Age Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Smile size={16} className="text-violet-500" />
            Age Group
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {AGE_GROUPS.map((group) => {
              const selected = age === group.value;
              return (
                <button
                  key={group.value}
                  type="button"
                  onClick={() => {
                    setAge(group.value);
                    if (errors.age) setErrors({ ...errors, age: "" });
                  }}
                  className={`py-2 px-3 text-xs md:text-sm rounded-xl font-medium transition-all duration-200 border cursor-pointer ${selected
                      ? "bg-violet-600/30 border-violet-500 text-[var(--foreground)] shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                      : "bg-slate-800/10 dark:bg-slate-800/40 border-[var(--input-border)] text-[var(--text-muted)] hover:border-violet-500/50 hover:text-[var(--foreground)]"
                    }`}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
          {errors.age && (
            <span className="text-xs text-red-500 dark:text-rose-400 font-medium pl-1">{errors.age}</span>
          )}
        </div>

        {/* Budget Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
            <DollarSign size={16} className="text-violet-500" />
            Budget
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {budgetOptions.map((b) => {
              const selected = budget === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBudget(b);
                    if (errors.budget) setErrors({ ...errors, budget: "" });
                  }}
                  className={`py-2 px-3 text-xs md:text-sm rounded-xl font-medium transition-all duration-200 border text-center cursor-pointer ${selected
                      ? "bg-violet-600/30 border-violet-500 text-[var(--foreground)] shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                      : "bg-slate-800/10 dark:bg-slate-800/40 border-[var(--input-border)] text-[var(--text-muted)] hover:border-violet-500/50 hover:text-[var(--foreground)]"
                    }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
          {errors.budget && (
            <span className="text-xs text-red-500 dark:text-rose-400 font-medium pl-1">{errors.budget}</span>
          )}
        </div>

        {/* Interests Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Heart size={16} className="text-violet-500" />
            Interests & Hobbies
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g. gaming, cooking, camping, reading, fashion"
            className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:ring-2 focus:ring-violet-500/20"
          />
          <p className="text-[11px] text-[var(--text-muted)] pl-1">
            Separate multiple interests with commas.
          </p>
        </div>

        {/* Vibe Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--foreground)] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Tag size={16} className="text-violet-500" />
              Personality Vibes (Select up to 3)
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {selectedVibes.length}/3 selected
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {VIBE_TAGS.map((vibe) => {
              const selected = selectedVibes.includes(vibe);
              const disabled = !selected && selectedVibes.length >= 3;
              return (
                <button
                  key={vibe}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleVibeToggle(vibe)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${selected
                      ? "bg-indigo-600/30 border-indigo-500 text-indigo-600 dark:text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                      : disabled
                        ? "bg-gray-950/20 border-white/2 text-gray-600 cursor-not-allowed"
                        : "bg-slate-800/10 dark:bg-slate-800/20 border-[var(--input-border)] text-[var(--text-muted)] hover:border-violet-500/50 hover:text-[var(--foreground)]"
                    }`}
                >
                  {vibe}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-rose-600 hover:from-violet-500 hover:via-indigo-500 hover:to-rose-500 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Curating gift ideas...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} className="animate-pulse" />
                <span>Generate Recommendations</span>
                <Gift size={18} className="transition-transform duration-300 group-hover:scale-110" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
