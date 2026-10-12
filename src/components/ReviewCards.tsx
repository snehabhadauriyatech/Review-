import React, { useState } from 'react';
import { Star, Copy, ExternalLink, Check, Edit3, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { ReviewDraft } from '../types/review';
import { copyToClipboard } from '../utils/googleReviewUrl';

interface ReviewCardsProps {
  reviews: ReviewDraft[];
  businessName: string;
  rating: number;
  keywords?: string[];
  googleReviewUrl: string;
  onOpenRedirect: (reviewText: string) => void;
}

export const ReviewCards: React.FC<ReviewCardsProps> = ({
  reviews,
  businessName,
  rating,
  keywords = [],
  googleReviewUrl,
  onOpenRedirect,
}) => {
  const [editedReviews, setEditedReviews] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPolishing, setIsPolishing] = useState<string | null>(null);

  const getReviewText = (r: ReviewDraft) => {
    return editedReviews[r.id] !== undefined ? editedReviews[r.id] : r.reviewText;
  };

  const handleCopyOnly = async (r: ReviewDraft) => {
    const text = getReviewText(r);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(r.id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const handleCopyAndRedirect = async (r: ReviewDraft) => {
    const text = getReviewText(r);
    await copyToClipboard(text);
    onOpenRedirect(text);
  };

  const handlePolishText = async (r: ReviewDraft) => {
    const current = getReviewText(r);
    setIsPolishing(r.id);
    try {
      const res = await fetch('/api/enhance-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftText: current,
          businessName,
          rating,
        }),
      });
      const data = await res.json();
      if (data.variations && data.variations[0]) {
        setEditedReviews((prev) => ({
          ...prev,
          [r.id]: data.variations[0].text,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPolishing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              3 AI-Generated Reviews Ready for Google
            </h3>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Select your preferred vibe, edit anything, then copy & post directly to Google Business Profile.
          </p>
        </div>

        {/* Target Destination Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Target: {businessName || 'Business Profile'}</span>
        </div>
      </div>

      {/* Embedded SEO Keywords Banner */}
      {keywords.length > 0 && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50/70 via-blue-50/50 to-emerald-50/70 border border-slate-200/70 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Google Local SEO Keywords Included:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-white px-2 py-0.5 rounded-md text-slate-700 border border-slate-200 shadow-2xs"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3 Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((r, index) => {
          const currentText = getReviewText(r);
          const isEditing = editingId === r.id;
          const charCount = currentText.length;
          const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;

          // Color themes for card styles
          const styleBadge =
            index === 0
              ? { bg: 'bg-blue-50 text-blue-700 border-blue-200', tag: '🌟 Warm & Authentic' }
              : index === 1
              ? { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', tag: '⚡ Quick & Punchy' }
              : { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', tag: '🗺️ Local Guide Style' };

          return (
            <div
              key={r.id || index}
              className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 pb-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${styleBadge.bg}`}
                  >
                    {r.style || styleBadge.tag}
                  </span>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5" title={`${rating} Stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {r.title || `Review Option #${index + 1}`}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{wordCount} words ({charCount} chars)</span>
                  <button
                    type="button"
                    onClick={() => setEditingId(isEditing ? null : r.id)}
                    className="text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    {isEditing ? 'Done Editing' : 'Edit Draft'}
                  </button>
                </div>
              </div>

              {/* Review Text Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                {isEditing ? (
                  <div className="space-y-2 mb-4">
                    <textarea
                      value={currentText}
                      onChange={(e) =>
                        setEditedReviews((prev) => ({
                          ...prev,
                          [r.id]: e.target.value,
                        }))
                      }
                      rows={7}
                      className="w-full text-xs sm:text-sm text-slate-800 p-3 bg-slate-50 border border-blue-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans leading-relaxed"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handlePolishText(r)}
                        disabled={isPolishing === r.id}
                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                      >
                        <RefreshCw className={`w-3 h-3 ${isPolishing === r.id ? 'animate-spin' : ''}`} />
                        {isPolishing === r.id ? 'Polishing...' : 'Polish with AI'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-xs px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-sm text-slate-700 leading-relaxed italic bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                      "{currentText}"
                    </p>
                  </div>
                )}

                {/* Highlight badges */}
                {r.highlights && r.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {r.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Actions Footer */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-2">
                {/* Primary CTA: Copy & Redirect */}
                <button
                  type="button"
                  onClick={() => handleCopyAndRedirect(r)}
                  className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 group"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Copy & Open Google Review</span>
                  <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                {/* Secondary: Quick Copy Only */}
                <button
                  type="button"
                  onClick={() => handleCopyOnly(r)}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedId === r.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Text Only</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
