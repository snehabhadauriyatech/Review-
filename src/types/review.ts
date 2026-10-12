export interface BusinessProfile {
  name: string;
  category: string;
  placeId?: string;
  customReviewUrl?: string;
  address?: string;
  logoUrl?: string;
}

export interface ReviewDraft {
  id: string;
  title: string;
  style: string;
  reviewText: string;
  characterCount?: number;
  wordCount?: number;
  highlights?: string[];
}

export interface ReviewGenerationResult {
  businessName: string;
  suggestedRating: number;
  keywords: string[];
  reviews: ReviewDraft[];
}

export interface ReviewFormState {
  businessName: string;
  businessCategory: string;
  placeId: string;
  customReviewUrl: string;
  address: string;
  rating: number;
  selectedHighlights: string[];
  serviceName: string;
  staffName: string;
  customNotes: string;
  tone: 'authentic' | 'short_punchy' | 'detailed' | 'local_guide' | 'professional';
  language: string;
}
