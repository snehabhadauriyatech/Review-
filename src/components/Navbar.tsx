import React from 'react';
import { PenTool, QrCode, MessageSquare, MapPin, ExternalLink, Sparkles, Star } from 'lucide-react';

interface NavbarProps {
  activeTab: 'writer' | 'qrcode' | 'templates';
  onSelectTab: (tab: 'writer' | 'qrcode' | 'templates') => void;
  businessName: string;
  onOpenPlaceIdModal: () => void;
  reviewUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  businessName,
  onOpenPlaceIdModal,
  reviewUrl,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Google Multicolor Indicator */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/4 bg-blue-600"></div>
        <div className="h-full w-1/4 bg-red-500"></div>
        <div className="h-full w-1/4 bg-amber-400"></div>
        <div className="h-full w-1/4 bg-emerald-500"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Google Review Writer
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                <Sparkles className="w-2.5 h-2.5 text-blue-600" /> & Direct Redirect
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              AI-crafted 5-star reviews + 1-click Google Business Profile redirection
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onSelectTab('writer')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'writer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Write Review</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('qrcode')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'qrcode'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QR Standee</span>
            <span className="sm:hidden">QR</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('templates')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Invites</span>
          </button>
        </div>
      </div>
    </header>
  );
};
