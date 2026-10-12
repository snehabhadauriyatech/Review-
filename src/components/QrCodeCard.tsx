import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, ExternalLink, Star, QrCode as QrIcon, Check, Copy } from 'lucide-react';
import { copyToClipboard } from '../utils/googleReviewUrl';

interface QrCodeCardProps {
  businessName: string;
  reviewUrl: string;
}

export const QrCodeCard: React.FC<QrCodeCardProps> = ({
  businessName,
  reviewUrl,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [headline, setHeadline] = useState('Review Us On Google!');
  const [subtitle, setSubtitle] = useState('Scan to rate us 5 stars in 30 seconds');
  const [copiedLink, setCopiedLink] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reviewUrl) return;

    QRCode.toDataURL(reviewUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [reviewUrl]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${(businessName || 'google-review').toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(reviewUrl);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <QrIcon className="w-5 h-5 text-blue-600" />
            Google Review QR Code & Table Standee
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Print this for your front desk, dining tables, checkout counter, or delivery receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download QR (PNG)
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Table Tent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Printable Standee Preview Card */}
        <div className="md:col-span-7 flex justify-center">
          <div
            ref={printRef}
            className="w-full max-w-sm bg-white rounded-3xl p-7 border-2 border-slate-200 shadow-xl flex flex-col items-center text-center space-y-4 print:border-none print:shadow-none print:m-0"
          >
            {/* Google Brand Logo Accent */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-2xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-xs font-bold text-slate-800 tracking-wide">
                Google Business Profile
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {headline}
              </h4>
              <p className="text-xs text-slate-500 max-w-[240px] mx-auto font-medium">
                {subtitle}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-inner">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Google Review QR Code"
                  className="w-52 h-52 object-contain"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Business Name Badge */}
            <div className="pt-1">
              <span className="text-sm font-bold text-slate-800">
                {businessName || 'Our Business'}
              </span>
              <p className="text-[11px] text-slate-400">
                Point your phone camera to write a review
              </p>
            </div>
          </div>
        </div>

        {/* Customization & Controls */}
        <div className="md:col-span-5 space-y-5">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Customize Standee Text
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Target URL Info */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <label className="text-xs font-medium text-slate-600 block">
                Destination Review URL:
              </label>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] font-mono text-blue-700 break-all select-all">
                {reviewUrl}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Copied Link' : 'Copy Link'}
                </button>
                <a
                  href={reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Test URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
