import React, { useState } from 'react';
import { ExternalLink, Check, Copy, Star, X, Sparkles, ArrowRight } from 'lucide-react';
import { copyToClipboard } from '../utils/googleReviewUrl';

interface RedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewText: string;
  rating: number;
  businessName: string;
  redirectUrl: string;
}

export const RedirectModal: React.FC<RedirectModalProps> = ({
  isOpen,
  onClose,
  reviewText,
  rating,
  businessName,
  redirectUrl,
}) => {
  const [copiedAgain, setCopiedAgain] = useState(false);

  if (!isOpen) return null;

  const handleRecopy = async () => {
    const success = await copyToClipboard(reviewText);
    if (success) {
      setCopiedAgain(true);
      setTimeout(() => setCopiedAgain(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scale-up">
        {/* Top Accent Bar with Google Colors */}
        <div className="h-2 w-full flex">
          <div className="h-full w-1/4 bg-blue-600"></div>
          <div className="h-full w-1/4 bg-red-500"></div>
          <div className="h-full w-1/4 bg-amber-400"></div>
          <div className="h-full w-1/4 bg-emerald-500"></div>
        </div>

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3 h-3" /> Ready to Post
              </span>
              <h3 className="text-xl font-bold text-slate-900">Review Copied to Clipboard!</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Guide */}
        <div className="px-6 py-2 space-y-5">
          <p className="text-sm text-slate-600 leading-relaxed">
            Your custom {rating}-star review for <strong className="text-slate-900 font-semibold">{businessName}</strong> has been copied. Now simply paste it on Google:
          </p>

          {/* 3 Step Visual Checklist */}
          <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-slate-100 shadow-xs">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mb-1.5">
                1
              </span>
              <span className="text-[11px] font-semibold text-slate-800">Open Page</span>
              <span className="text-[10px] text-slate-500">Click below to launch Google</span>
            </div>

            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-slate-100 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mb-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              </div>
              <span className="text-[11px] font-semibold text-slate-800">Tap 5 Stars</span>
              <span className="text-[10px] text-slate-500">Select your star rating</span>
            </div>

            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-slate-100 shadow-xs">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center mb-1.5">
                3
              </span>
              <span className="text-[11px] font-semibold text-slate-800">Paste & Post</span>
              <span className="text-[10px] text-slate-500">Press Ctrl+V / ⌘+V</span>
            </div>
          </div>

          {/* Copied Review Text Preview Box */}
          <div className="relative rounded-2xl bg-slate-900 text-slate-200 p-4 border border-slate-800 shadow-inner group">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 border-b border-slate-800 pb-2">
              <span className="font-mono text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                In your clipboard:
              </span>
              <button
                type="button"
                onClick={handleRecopy}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                {copiedAgain ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedAgain ? 'Copied again!' : 'Re-copy text'}
              </button>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-sans line-clamp-4 italic">
              "{reviewText}"
            </p>
          </div>
        </div>

        {/* Modal Footer / Primary CTA */}
        <div className="p-6 pt-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2.5">
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              // Auto close slightly after opening
              setTimeout(onClose, 800);
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group text-center"
          >
            <span>Open Google Business Review Page Now</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Opens Google Maps / Business Profile in a new tab
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
