import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ReviewWizard } from './components/ReviewWizard';
import { ReviewCards } from './components/ReviewCards';
import { QrCodeCard } from './components/QrCodeCard';
import { ShareRequestTemplates } from './components/ShareRequestTemplates';
import { PlaceIdFinderModal } from './components/PlaceIdFinderModal';
import { RedirectModal } from './components/RedirectModal';
import { ReviewFormState, ReviewGenerationResult } from './types/review';
import { SAMPLE_BUSINESSES } from './constants/presets';
import { buildGoogleReviewUrl } from './utils/googleReviewUrl';
import {
  Sparkles,
  ShieldCheck,
  Star,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const STORAGE_KEY = 'google_review_writer_state';

export default function App() {
  const [activeTab, setActiveTab] = useState<'writer' | 'qrcode' | 'templates'>('writer');

  // Initial Form state
  const [form, setForm] = useState<ReviewFormState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved state', e);
    }
    const defaultBusiness = SAMPLE_BUSINESSES[0];
    return {
      businessName: defaultBusiness.name,
      businessCategory: defaultBusiness.category,
      placeId: defaultBusiness.placeId || '',
      customReviewUrl: '',
      address: defaultBusiness.address || '',
      rating: 5,
      selectedHighlights: [
        'Delicious Food',
        'Warm Atmosphere',
        'Attentive Service',
        'Will Definitely Return',
      ],
      serviceName: 'Specialty pour-over coffee and fresh almond croissant',
      staffName: 'Sarah',
      customNotes: 'Staff was so warm and welcoming, perfect spot to work or relax with friends.',
      tone: 'authentic',
      language: 'English',
    };
  });

  const [generatedResults, setGeneratedResults] = useState<ReviewGenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isPlaceIdModalOpen, setIsPlaceIdModalOpen] = useState(false);
  const [redirectModalState, setRedirectModalState] = useState<{
    isOpen: boolean;
    reviewText: string;
    rating: number;
  }>({
    isOpen: false,
    reviewText: '',
    rating: 5,
  });

  // Save form changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [form]);

  // Compute direct Google Review link
  const currentReviewUrl = buildGoogleReviewUrl({
    placeId: form.placeId,
    customReviewUrl: form.customReviewUrl,
    businessName: form.businessName,
    address: form.address,
  });

  // Generate reviews via server endpoint
  const handleGenerate = async () => {
    if (!form.businessName.trim()) {
      setError('Please provide a business name.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to generate reviews. Please try again.');
      }

      const data: ReviewGenerationResult = await res.json();
      setGeneratedResults(data);

      // Smooth scroll to generated reviews
      setTimeout(() => {
        const resultsEl = document.getElementById('generated-results-anchor');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to connect to review generator service.');
    } finally {
      setIsLoading(false);
    }
  };

  // Triggered when user selects a review to post on Google
  const handleOpenRedirect = (reviewText: string) => {
    setRedirectModalState({
      isOpen: true,
      reviewText,
      rating: form.rating,
    });
  };

  // Update partial form
  const handleFormChange = (updated: Partial<ReviewFormState>) => {
    setForm((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        businessName={form.businessName}
        onOpenPlaceIdModal={() => setIsPlaceIdModalOpen(true)}
        reviewUrl={currentReviewUrl}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Error notification */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs font-semibold text-red-800 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Review Writer */}
        {activeTab === 'writer' && (
          <div className="space-y-10">
            {/* Hero / Value Proposition Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                AI-Assisted Customer Reviews
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Craft 5-Star Google Reviews & Post in 1-Click
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Overcome writer's block. Select what you enjoyed, generate 3 authentic reviews tailored for Google algorithms, and redirect straight to the business review page!
              </p>
            </div>

            {/* Step 1: Input & Configuration Wizard */}
            <ReviewWizard
              form={form}
              onChange={handleFormChange}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              onOpenPlaceIdModal={() => setIsPlaceIdModalOpen(true)}
            />

            {/* Anchor for auto scroll */}
            <div id="generated-results-anchor"></div>

            {/* Step 2: Generated Review Cards */}
            {generatedResults && (
              <div className="animate-fade-in pt-4">
                <ReviewCards
                  reviews={generatedResults.reviews}
                  businessName={form.businessName}
                  rating={form.rating}
                  keywords={generatedResults.keywords}
                  googleReviewUrl={currentReviewUrl}
                  onOpenRedirect={handleOpenRedirect}
                />
              </div>
            )}

            {/* Value Highlights & How It Works */}
            <div className="pt-8 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4 text-center">
                Why This Helps Businesses & Customers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    No Friction or Writer's Block
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Most customers want to leave 5 stars but don't know what to write. AI helps phrase their genuine appreciation in seconds.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    SEO & Google Maps Keyword Boost
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Reviews mentioning specific services and staff names help businesses rank significantly higher in Google Local 3-Pack searches.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Direct Deep-Link Redirection
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Uses Google's official <code className="font-mono text-[11px] text-blue-600">writereview?placeid=...</code> format so customers don't have to search or navigate manually.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: QR Standee Generator */}
        {activeTab === 'qrcode' && (
          <div className="animate-fade-in">
            <QrCodeCard
              businessName={form.businessName}
              reviewUrl={currentReviewUrl}
            />
          </div>
        )}

        {/* Tab 3: Customer Outreach Templates */}
        {activeTab === 'templates' && (
          <div className="animate-fade-in">
            <ShareRequestTemplates
              businessName={form.businessName}
              reviewUrl={currentReviewUrl}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              Google Business Profile Review Writer & Direct Redirector
            </span>
            <span>•</span>
            <span>Powered by Gemini 3.8</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsPlaceIdModalOpen(true)}
              className="text-blue-600 hover:underline font-medium"
            >
              Configure Place ID
            </button>
            <span>•</span>
            <a
              href={currentReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span>Current Target Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Place ID Modal */}
      <PlaceIdFinderModal
        isOpen={isPlaceIdModalOpen}
        onClose={() => setIsPlaceIdModalOpen(false)}
        currentPlaceId={form.placeId}
        currentReviewUrl={form.customReviewUrl}
        onSave={(placeId, customReviewUrl) => {
          handleFormChange({ placeId, customReviewUrl });
        }}
      />

      {/* Redirect Modal */}
      <RedirectModal
        isOpen={redirectModalState.isOpen}
        onClose={() =>
          setRedirectModalState((prev) => ({ ...prev, isOpen: false }))
        }
        reviewText={redirectModalState.reviewText}
        rating={redirectModalState.rating}
        businessName={form.businessName}
        redirectUrl={currentReviewUrl}
      />
    </div>
  );
}
