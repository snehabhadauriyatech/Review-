import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with standard aistudio-build telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GenerateReviewRequest {
  businessName: string;
  businessCategory?: string;
  rating?: number;
  selectedHighlights?: string[];
  customNotes?: string;
  staffName?: string;
  serviceName?: string;
  tone?: string;
  language?: string;
}

// Endpoint to generate authentic Google Business reviews
app.post('/api/generate-reviews', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      businessName,
      businessCategory = 'Local Business',
      rating = 5,
      selectedHighlights = [],
      customNotes = '',
      staffName = '',
      serviceName = '',
      tone = 'authentic',
      language = 'English',
    }: GenerateReviewRequest = req.body;

    if (!businessName || !businessName.trim()) {
      res.status(400).json({ error: 'Business name is required' });
      return;
    }

    const prompt = `You are an expert at writing authentic, natural-sounding, and high-converting Google Business Profile reviews.
A customer is writing a review for the following business:
- Business Name: "${businessName}"
- Industry / Category: "${businessCategory}"
- Customer Star Rating: ${rating} out of 5 stars
- Key Positive Highlights: ${selectedHighlights.length > 0 ? selectedHighlights.join(', ') : 'Great overall experience'}
- Specific Service / Dish / Product: ${serviceName || 'General service'}
- Specific Staff Member Mention: ${staffName || 'None specified'}
- Custom Notes / Details from customer: "${customNotes || 'None'}"
- Desired Tone: ${tone} (Options range from warm & friendly, concise & punchy, detailed Local Guide style, professional)
- Target Language: ${language}

Generate 3 diverse, distinct review options that sound like REAL, enthusiastic human customers (NEVER sound robotic or like promotional marketing copy):
1. "Authentic & Warm": Personal, genuine story, natural customer tone, expresses true appreciation.
2. "Quick & Punchy": 2 to 3 sentences, straight to the point, perfect for mobile users who want to review in 15 seconds.
3. "Detailed Local Guide": Thorough, informative, mentions specifics (service quality, staff, vibe, or ease of process), great for SEO and helping future customers make decisions.

Guidelines:
- If staff name "${staffName}" is provided, naturally give them a shoutout in at least 2 of the options.
- If service/product "${serviceName}" is provided, mention it naturally.
- Reflect the star rating (${rating}/5). For 5-star, be super positive and recommend unreservedly.
- Avoid clichés like "As an AI" or repetitive opening phrases.
- Include a short catchy title/hook for each option and an estimated reading time.
- Also list 3-5 high-value Google SEO keywords that naturally appear in these reviews (e.g. "friendly customer service", "best dentist in town").`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessName: { type: Type.STRING },
            suggestedRating: { type: Type.INTEGER },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key phrases or SEO keywords naturally embedded in the reviews',
            },
            reviews: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING, description: 'Short catchy hook or label for this style' },
                  style: { type: Type.STRING, description: 'e.g., Authentic & Warm, Quick & Punchy, Detailed Local Guide' },
                  reviewText: { type: Type.STRING, description: 'The complete review text ready to be pasted on Google' },
                  characterCount: { type: Type.INTEGER },
                  wordCount: { type: Type.INTEGER },
                  highlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['id', 'title', 'style', 'reviewText'],
              },
            },
          },
          required: ['businessName', 'reviews'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating reviews:', error);
    res.status(500).json({
      error: 'Failed to generate reviews',
      message: error?.message || 'Internal server error',
    });
  }
});

// Endpoint to enhance or polish user's custom draft review
app.post('/api/enhance-review', async (req: Request, res: Response): Promise<void> => {
  try {
    const { draftText, businessName, rating = 5, tone = 'enthusiastic' } = req.body;

    if (!draftText || !draftText.trim()) {
      res.status(400).json({ error: 'Draft text is required' });
      return;
    }

    const prompt = `Rewrite and polish this draft customer review for "${businessName || 'the business'}" to make it sound natural, persuasive, and grammatically flawless for a Google Business Profile review:
Original draft: "${draftText}"
Star rating: ${rating} / 5
Tone requested: ${tone}

Return 2 improved variations:
1. "Polished Natural" - Keeps exact original meaning and voice but fixes flow and adds warmth.
2. "Elevated & Detailed" - Slightly more articulate and impactful for Google search ranking.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  text: { type: Type.STRING },
                },
                required: ['title', 'text'],
              },
            },
          },
          required: ['variations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error enhancing review:', error);
    res.status(500).json({ error: 'Failed to polish review', message: error?.message });
  }
});

// Endpoint to assist in finding Place ID or generating review redirect URLs
app.post('/api/parse-business-link', async (req: Request, res: Response): Promise<void> => {
  try {
    const { input } = req.body;
    if (!input || !input.trim()) {
      res.status(400).json({ error: 'Input is required' });
      return;
    }

    const trimmed = input.trim();

    // Check if input is a direct Place ID (typically ~27-30 chars starting with ChIJ...)
    const isPlaceId = /^ChIJ[a-zA-Z0-9_-]{20,}$/.test(trimmed);

    if (isPlaceId) {
      const reviewUrl = `https://search.google.com/local/writereview?placeid=${trimmed}`;
      res.json({
        type: 'place_id',
        placeId: trimmed,
        reviewUrl,
        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${trimmed}`,
      });
      return;
    }

    // Check if it's already a direct Google review link
    if (trimmed.includes('search.google.com/local/writereview') || trimmed.includes('g.page/r/')) {
      // Extract placeid if present
      const match = trimmed.match(/placeid=([a-zA-Z0-9_-]+)/);
      res.json({
        type: 'direct_url',
        placeId: match ? match[1] : null,
        reviewUrl: trimmed,
        mapsUrl: trimmed,
      });
      return;
    }

    // Default to search query URL
    const cleanQuery = trimmed.replace(/^https?:\/\/[^\s]+/, '').trim() || trimmed;
    const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanQuery)}`;
    
    res.json({
      type: 'query',
      placeId: null,
      reviewUrl: searchUrl,
      mapsUrl: searchUrl,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to parse business link' });
  }
});

// Server setup: Vite middleware in dev, static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
