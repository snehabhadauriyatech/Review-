import React, { useState } from 'react';
import { Search, ExternalLink, X, Check, HelpCircle, MapPin, Sparkles } from 'lucide-react';
import { isValidPlaceId } from '../utils/googleReviewUrl';

interface PlaceIdFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlaceId: string;
  currentReviewUrl: string;
  onSave: (placeId: string, customReviewUrl: string) => void;
}

export const PlaceIdFinderModal: React.FC<PlaceIdFinderModalProps> = ({
  isOpen,
  onClose,
  currentPlaceId,
  currentReviewUrl,
  onSave,
}) => {
  const [placeId, setPlaceId] = useState(currentPlaceId || '');
  const [customUrl, setCustomUrl] = useState(currentReviewUrl || '');
  const [pasteInput, setPasteInput] = useState('');
  const [parseStatus, setParseStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParseInput = async () => {
    if (!pasteInput.trim()) return;
    setParseStatus('Analyzing link...');
    try {
      const res = await fetch('/api/parse-business-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: pasteInput.trim() }),
      });
      const data = await res.json();
      if (data.placeId) {
        setPlaceId(data.placeId);
        setCustomUrl(data.reviewUrl || '');
        setParseStatus('Found Google Place ID successfully!');
      } else if (data.reviewUrl) {
        setCustomUrl(data.reviewUrl);
        setParseStatus('Direct review link detected!');
      } else {
        setParseStatus('Link saved as review search target.');
      }
    } catch {
      setParseStatus('Failed to parse. Please enter manually.');
    }
  };

  const handleApply = () => {
    onSave(placeId.trim(), customUrl.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Google Business Review Link Setup</h3>
              <p className="text-xs text-blue-100">Ensure reviews redirect straight to your Google 5-star box</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick link paste box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Quick Auto-Detector
              </label>
              <span className="text-xs text-slate-500">Paste any Google link or Place ID</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. ChIJN1t_tDeuEmsR... or https://g.page/r/..."
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleParseInput}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Auto-Detect
              </button>
            </div>
            {parseStatus && (
              <p className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded inline-block">
                {parseStatus}
              </p>
            )}
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Google Place ID (Recommended)
                </label>
                {placeId && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isValidPlaceId(placeId)
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {isValidPlaceId(placeId) ? '✓ Valid Place ID format' : 'Custom / Unverified'}
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g., ChIJN1t_tDeuEmsRUsoyG83frY4"
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Direct format generated:{' '}
                <code className="text-blue-700 font-mono text-[11px]">
                  https://search.google.com/local/writereview?placeid={placeId || 'YOUR_ID'}
                </code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Or Custom Google Review Link (g.page / short link)
              </label>
              <input
                type="url"
                placeholder="e.g., https://g.page/r/CdABCDEF/review"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* How to find your Place ID */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-2">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              How to find your Place ID in 15 seconds
            </h4>
            <ol className="text-xs text-blue-800/90 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>
                Open the official{' '}
                <a
                  href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:text-blue-900 inline-flex items-center gap-0.5"
                >
                  Google Place ID Finder Tool <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>Type your business name and city in the map search box.</li>
              <li>Click on your business; the Place ID (starts with <code className="font-mono font-bold">ChIJ...</code>) will appear in the popup!</li>
              <li>Copy and paste it into the field above.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
