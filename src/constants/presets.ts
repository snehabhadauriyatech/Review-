import { BusinessProfile } from '../types/review';

export const SAMPLE_BUSINESSES: (BusinessProfile & { description: string })[] = [
  {
    name: 'Artisan Roast Coffee Co.',
    category: 'Coffee Shop & Bakery',
    placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4', // Sydney Opera House area sample place ID
    address: '42 Market Street, Downtown',
    description: 'Specialty pour-overs, artisanal pastries, and cozy ambiance',
  },
  {
    name: 'Lumina Modern Dental Studio',
    category: 'Dental Clinic',
    placeId: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA', // Manhattan landmark sample ID
    address: '150 5th Avenue, Suite 400',
    description: 'Gentle dentistry, whitening, and painless restorative care',
  },
  {
    name: 'Summit Peak Auto Care',
    category: 'Auto Repair & Mechanic',
    placeId: 'ChIJV4k0Dx9ZwokRfr8Yq5eU5-0',
    address: '880 Industrial Way',
    description: 'Brake service, oil changes, engine diagnostics, transparent quotes',
  },
  {
    name: 'Velvet & Ivy Hair Salon',
    category: 'Hair Salon & Spa',
    placeId: 'ChIJ2eUgeAK6j4ARrPvtMOHog_k',
    address: '310 Blossom Blvd',
    description: 'Balayage, precision cuts, scalp treatments, master stylists',
  },
  {
    name: 'Bella Trattoria Italiana',
    category: 'Italian Restaurant',
    placeId: 'ChIJP3Sa8ziYEmsRUKgyFmh9AQM',
    address: '77 Heritage Lane',
    description: 'Wood-fired sourdough pizza, handmade pappardelle, wine pairings',
  },
];

export const CATEGORY_OPTIONS = [
  'Restaurant / Cafe',
  'Dental Clinic / Healthcare',
  'Hair Salon / Barber / Spa',
  'Auto Repair / Car Dealership',
  'Home Services / Contractor',
  'Fitness / Gym / Yoga',
  'Retail Store / Boutique',
  'Law Firm / Legal Services',
  'Real Estate Agency',
  'Hotel / Hospitality',
  'Professional / B2B Services',
  'General Local Business',
];

export const CATEGORY_HIGHLIGHTS: Record<string, string[]> = {
  'Restaurant / Cafe': [
    'Delicious Food',
    'Warm Atmosphere',
    'Attentive Service',
    'Fresh Ingredients',
    'Fast Seating',
    'Generous Portions',
    'Great Coffee / Drinks',
    'Clean & Cozy',
    'Accommodated Dietary Needs',
    'Reasonable Prices',
    'Will Definitely Return',
  ],
  'Dental Clinic / Healthcare': [
    'Gentle & Painless',
    'Friendly Staff',
    'State-of-the-Art Equipment',
    'Clear Explanations',
    'Clean & Sterile Office',
    'Minimal Wait Time',
    'Compassionate Bedside Manner',
    'Transparent Billing',
    'Made Me Feel at Ease',
    'Highly Recommended',
  ],
  'Hair Salon / Barber / Spa': [
    'Listened to What I Wanted',
    'Master Stylist',
    'Flawless Cut & Color',
    'Relaxing Atmosphere',
    'Complimentary Beverages',
    'High-End Products',
    'Punctual Appointment',
    'Great Styling Tips',
    'Felt Pampered & Refreshed',
  ],
  'Auto Repair / Car Dealership': [
    'Honest Diagnostics',
    'Fast Turnaround',
    'Fair & Transparent Pricing',
    'No Unnecessary Upsells',
    'Knowledgeable Mechanics',
    'Clean Waiting Lounge',
    'Clear Communication',
    'Car Runs Perfectly Now',
    'Trustworthy Team',
  ],
  'Home Services / Contractor': [
    'Arrived Right on Time',
    'Upfront Accurate Quote',
    'Spotless Clean-Up Afterward',
    'High Attention to Detail',
    'Polite & Professional',
    'Solved Issue Quickly',
    'Quality Craftsmanship',
    'Great Value for Money',
  ],
  default: [
    'Outstanding Customer Service',
    'Friendly & Welcoming Staff',
    'Quick & Efficient Service',
    'Exceeded Expectations',
    'High Quality Work',
    'Fair & Honest Pricing',
    'Clean & Modern Facility',
    'Great Communication',
    'Highly Recommended',
    'Will Be Coming Back',
  ],
};

export const TONE_OPTIONS = [
  {
    id: 'authentic',
    label: 'Warm & Authentic',
    icon: 'Sparkles',
    desc: 'Natural, friendly customer voice with genuine appreciation',
  },
  {
    id: 'short_punchy',
    label: 'Quick & Punchy',
    icon: 'Zap',
    desc: '2-3 impactful sentences, easy to read on mobile devices',
  },
  {
    id: 'local_guide',
    label: 'Google Local Guide',
    icon: 'Compass',
    desc: 'Informative, SEO-friendly, includes specifics that help searchers',
  },
  {
    id: 'professional',
    label: 'Professional & Polished',
    icon: 'Briefcase',
    desc: 'Articulate, balanced, objective, and well-structured',
  },
];

export const LANGUAGE_OPTIONS = [
  'English',
  'Spanish (Español)',
  'French (Français)',
  'German (Deutsch)',
  'Italian (Italiano)',
  'Portuguese (Português)',
  'Hindi (हिन्दी)',
  'Japanese (日本語)',
  'Chinese (中文)',
  'Arabic (العربية)',
];
