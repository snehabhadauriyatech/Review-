import React, { useState, useEffect } from 'react';
import {
  Star,
  Sparkles,
  MapPin,
  Settings,
  ExternalLink,
  Plus,
  Check,
  Zap,
  Globe,
  Tag,
  Smile,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import {
  CATEGORY_OPTIONS,
  CATEGORY_HIGHLIGHTS,
  TONE_OPTIONS,
  LANGUAGE_OPTIONS,
  SAMPLE_BUSINESSES,
} from '../constants/presets';
import { ReviewFormState } from '../types/review';
import { buildGoogleReviewUrl, isValidPlaceId } from '../utils/googleReviewUrl';

interface ReviewWizardProps {
  form: ReviewFormState;
  onChange: (updated: Partial<ReviewFormState>) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onOpenPlaceIdModal: () => void;
}

export const ReviewWizard: React.FC<ReviewWizardProps> = ({
  form,
  onChange,
  onGenerate,
  isLoading,
  onOpenPlaceIdModal,
}) => {
  const [customTagInput, setCustomTagInput] = useState('');
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);

  // Available highlights based on current category
  const availableHighlights =
    CATEGORY_HIGHLIGHTS[form.businessCategory] || CATEGORY_HIGHLIGHTS.default;

  const toggleHighlight = (tag: string) => {
    if (form.selectedHighlights.includes(tag)) {
      onChange({
        selectedHighlights: form.selectedHighlights.filter((t) => t !== tag),
      });
    } else {
      onChange({
        selectedHighlights: [...form.selectedHighlights, tag],
      });
    }
  };

  const addCustomTag = () => {
    if (!customTagInput.trim()) return;
    if (!form.selectedHighlights.includes(customTagInput.trim())) {
      onChange({
        selectedHighlights: [...form.selectedHighlights, customTagInput.trim()],
      });
    }
    setCustomTagInput('');
  };

  const handleSelectPreset = (b: typeof SAMPLE_BUSINESSES[0]) => {
    onChange({
      businessName: b.name,
      businessCategory: b.category,
      placeId: b.placeId || '',
      address: b.address || '',
      selectedHighlights: ['Outstanding Customer Service', 'Highly Recommended'],
    });
    setShowPresetsDropdown(false);
  };

  const computedReviewUrl = buildGoogleReviewUrl({
    placeId: form.placeId,
    customReviewUrl: form.customReviewUrl,
    businessName: form.businessName,
    address: form.address,
  });

  const ratingDescriptions: Record<number, string> = {
    5: '5 Stars - Exceptional & Outstanding Experience!',
    4: '4 Stars - Great Experience with Minor Suggestions',
    3: '3 Stars - Decent / Average Experience',
    2: '2 Stars - Below Expectations',
    1: '1 Star - Significant Issues Faced',
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Banner / Business Destination Ribbon */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Target Business Profile
            </span>
          </div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>{form.businessName || 'Your Business Name'}</span>
          </h2>
          <p className="text-xs text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            {form.address || 'Address or city not specified'}
          </p>
        </div>

        {/* Quick Tools & Preset Selection */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sample Preset Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresetsDropdown(!showPresetsDropdown)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium border border-white/15 transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Load Sample Business ▾</span>
            </button>

            {showPresetsDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 py-2 z-30">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  Try with real presets
                </div>
                {SAMPLE_BUSINESSES.map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => handleSelectPreset(b)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex flex-col"
                  >
                    <span className="text-xs font-semibold text-slate-900">{b.name}</span>
                    <span className="text-[11px] text-slate-500">{b.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Place ID Status / Configure Button */}
          <button
            type="button"
            onClick={onOpenPlaceIdModal}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>
              {form.placeId ? 'Place ID Configured ✓' : 'Setup Review Link'}
            </span>
          </button>

          {/* Direct Link Test Button */}
          <a
            href={computedReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium border border-white/15 transition-all flex items-center gap-1.5"
            title="Test redirection to Google Review page"
          >
            <span>Test Redirect</span>
            <ExternalLink className="w-3 h-3 text-blue-300" />
          </a>
        </div>
      </div>

      {/* Form Fields Section */}
      <div className="p-6 sm:p-8 space-y-7">
        {/* Row 1: Business Name, Category & Star Rating */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Business Name */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Bella Napoli Pizzeria"
              value={form.businessName}
              onChange={(e) => onChange({ businessName: e.target.value })}
              className="w-full px-4 py-2.5 text-sm font-medium bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Industry Category */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Industry / Category
            </label>
            <select
              value={form.businessCategory}
              onChange={(e) => onChange({ businessCategory: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Star Rating Interactive Selector */}
          <div className="md:col-span-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Rating
              </label>
              <span className="text-xs font-semibold text-amber-600">
                {form.rating} / 5 Stars
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onChange({ rating: star })}
                  className="p-1.5 hover:scale-110 active:scale-95 transition-transform"
                  aria-label={`${star} star`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= form.rating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                        : 'fill-slate-200 text-slate-300 hover:text-amber-200'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {ratingDescriptions[form.rating]}
            </p>
          </div>
        </div>

        {/* Row 2: Experience Highlights / What stood out? */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                Key Highlights & Positive Points
              </label>
              <p className="text-xs text-slate-500">
                Tap the points that made the experience memorable:
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {form.selectedHighlights.length} selected
            </span>
          </div>

          {/* Chips grid */}
          <div className="flex flex-wrap gap-2">
            {availableHighlights.map((highlight) => {
              const isSelected = form.selectedHighlights.includes(highlight);
              return (
                <button
                  key={highlight}
                  type="button"
                  onClick={() => toggleHighlight(highlight)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  <span>{highlight}</span>
                </button>
              );
            })}
          </div>

          {/* Custom chip adder */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="+ Add a custom highlight (e.g. Free valet parking, Sarah was amazing)..."
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-80 max-w-full"
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>
        </div>

        {/* Row 3: Specific details (Service availed, Staff shoutout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Specific Service / Product / Dish
            </label>
            <input
              type="text"
              placeholder="e.g. Avocado Toast & Chai Latte, Tooth Whitening, Oil Change..."
              value={form.serviceName}
              onChange={(e) => onChange({ serviceName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <p className="text-[11px] text-slate-400">
              Mentioning specific services helps Google verify review authenticity.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Staff Member to Shoutout (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah, Marco, Dr. Miller..."
              value={form.staffName}
              onChange={(e) => onChange({ staffName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <p className="text-[11px] text-slate-400">
              Staff shoutouts dramatically increase review credibility and team morale.
            </p>
          </div>
        </div>

        {/* Row 4: Custom Notes / Personal Story (Optional) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Any Extra Notes or Specific Story (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. We were seated immediately even during Saturday rush hour, and the atmosphere was super cozy..."
            value={form.customNotes}
            onChange={(e) => onChange({ customNotes: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          />
        </div>

        {/* Row 5: Tone & Language */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 border-t border-slate-100">
          {/* Tone Selector */}
          <div className="md:col-span-8 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Review Persona / Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TONE_OPTIONS.map((t) => {
                const isSelected = form.tone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onChange({ tone: t.id as any })}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs ring-1 ring-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs font-bold mb-0.5">{t.label}</span>
                    <span className="block text-[10px] text-slate-500 line-clamp-2 leading-tight">
                      {t.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selector */}
          <div className="md:col-span-4 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              Language
            </label>
            <select
              value={form.language}
              onChange={(e) => onChange({ language: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Generates culturally authentic local expressions.
            </p>
          </div>
        </div>

        {/* Generate Reviews Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isLoading || !form.businessName.trim()}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Crafting 3 Authentic Reviews with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>Generate 3 Google Review Options</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1 font-mono">
                  Instant
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
