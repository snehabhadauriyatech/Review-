/**
 * Google Business Profile Review URL utilities
 */

export function buildGoogleReviewUrl(params: {
  placeId?: string;
  customReviewUrl?: string;
  businessName?: string;
  address?: string;
}): string {
  // If direct custom review URL provided, use it
  if (params.customReviewUrl && params.customReviewUrl.trim()) {
    return params.customReviewUrl.trim();
  }

  // If Place ID provided, construct the official Google Review intent URL
  if (params.placeId && params.placeId.trim()) {
    const cleanId = params.placeId.trim();
    return `https://search.google.com/local/writereview?placeid=${cleanId}`;
  }

  // Fallback to Google Maps Search URL
  const query = [params.businessName, params.address]
    .filter(Boolean)
    .join(' ')
    .trim();

  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  return 'https://maps.google.com';
}

/**
 * Validates whether a string looks like a valid Google Place ID
 * Google Place IDs are alphanumeric strings usually ~27-35 chars, starting with ChIJ
 */
export function isValidPlaceId(placeId: string): boolean {
  if (!placeId) return false;
  const trimmed = placeId.trim();
  return trimmed.startsWith('ChIJ') && trimmed.length >= 20;
}

/**
 * Copy text to clipboard with modern API and reliable fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard writeText failed, using execCommand fallback', err);
  }

  // Fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    return false;
  }
}
