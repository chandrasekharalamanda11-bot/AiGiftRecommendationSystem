"use client";

import { useState } from "react";
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

const BUDGETS = [
  "Under $25", "$25-$50", "$50-$100", "$100-$250", "$250+"
];

const VIBE_TAGS = [
  "Cozy", "Techie", "Practical", "Creative", 
  "Adventurous", "Sentimental", "Trendy", "Luxurious"
];

export default function GiftForm({ onSubmit, isLoading }) {
  const [relationship, setRelationship] = useState("");
  const [age, setAge] = useState("");
  const [occasion, setOccasion] = useState("");
  const [interests, setInterests] = useState("");
  const [budget, setBudget] = useState("$50-$100");
  const [selectedVibes, setSelectedVibes] = useState([]);
  
  // Validation error state
  const [errors, setErrors] = useState({});

  const handleVibeToggle = (vibe) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
    } else {
      // Allow up to 3 vibes
      if (selectedVibes.length < 3) {
        setSelectedVibes([...selectedVibes, vibe]);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!relationship) newErrors.relationship = "Please select a relationship";
    if (!age) newErrors.age = "Please select an age group";
    if (!occasion) newErrors.occasion = "Please select an occasion";
    if (!budget) newErrors.budget = "Please select a budget range";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      relationship,
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
      className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden border border-white/10 w-full animate-fade-in-up"
    >
      {/* Decorative top ambient light */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      
      <div className="space-y-6">
        {/* Recipient and Occasion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Relationship */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User size={16} className="text-violet-400" />
              Recipient Relationship
            </label>
            <div className="relative">
              <select
                value={relationship}
                onChange={(e) => {
                  setRelationship(e.target.value);
                  if (errors.relationship) setErrors({ ...errors, relationship: "" });
                }}
                className={`w-full glass-input rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500/20 ${
                  errors.relationship ? "border-rose-500/50 focus:border-rose-500" : ""
                }`}
              >
                <option value="" disabled className="bg-gray-900 text-gray-400">Select relationship...</option>
                {RELATIONSHIPS.map((rel) => (
                  <option key={rel} value={rel} className="bg-gray-900 text-white">
                    {rel}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.relationship && (
              <span className="text-xs text-rose-400 font-medium pl-1">{errors.relationship}</span>
            )}
          </div>

          {/* Occasion */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Calendar size={16} className="text-violet-400" />
              Occasion
            </label>
            <div className="relative">
              <select
                value={occasion}
                onChange={(e) => {
                  setOccasion(e.target.value);
                  if (errors.occasion) setErrors({ ...errors, occasion: "" });
                }}
                className={`w-full glass-input rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500/20 ${
                  errors.occasion ? "border-rose-500/50 focus:border-rose-500" : ""
                }`}
              >
                <option value="" disabled className="bg-gray-900 text-gray-400">Select occasion...</option>
                {OCCASIONS.map((occ) => (
                  <option key={occ} value={occ} className="bg-gray-900 text-white">
                    {occ}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.occasion && (
              <span className="text-xs text-rose-400 font-medium pl-1">{errors.occasion}</span>
            )}
          </div>
        </div>

        {/* Age Group Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Smile size={16} className="text-violet-400" />
            Recipient Age Group
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
                  className={`py-2 px-3 text-xs md:text-sm rounded-xl font-medium transition-all duration-200 border ${
                    selected
                      ? "bg-violet-600/30 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                      : "bg-gray-800/40 border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                  }`}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
          {errors.age && (
            <span className="text-xs text-rose-400 font-medium pl-1">{errors.age}</span>
          )}
        </div>

        {/* Budget Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <DollarSign size={16} className="text-violet-400" />
            Budget Level
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {BUDGETS.map((b) => {
              const selected = budget === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBudget(b);
                    if (errors.budget) setErrors({ ...errors, budget: "" });
                  }}
                  className={`py-2 px-3 text-xs md:text-sm rounded-xl font-medium transition-all duration-200 border text-center ${
                    selected
                      ? "bg-violet-600/30 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                      : "bg-gray-800/40 border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
          {errors.budget && (
            <span className="text-xs text-rose-400 font-medium pl-1">{errors.budget}</span>
          )}
        </div>

        {/* Interests and Hobbies */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Heart size={16} className="text-violet-400" />
            Interests & Hobbies
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g. gaming, cooking, camping, historical novels, fitness"
            className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-violet-500/20"
          />
          <p className="text-[11px] text-gray-400 pl-1">
            Separate interests with commas to help our AI construct unique suggestions.
          </p>
        </div>

        {/* Recipient Vibe Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Tag size={16} className="text-violet-400" />
              Recipient Vibe / Personality (Select up to 3)
            </span>
            <span className="text-xs text-gray-400">
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
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    selected
                      ? "bg-indigo-600/30 border-indigo-500 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                      : disabled
                      ? "bg-gray-950/20 border-white/2 text-gray-600 cursor-not-allowed"
                      : "bg-gray-800/20 border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                  }`}
                >
                  {vibe}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-rose-600 hover:from-violet-500 hover:via-indigo-500 hover:to-rose-500 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Pulsing glow background effect */}
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
                <span>Unwrap AI Recommendations</span>
                <Gift size={18} className="transition-transform duration-300 group-hover:scale-110" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
