import React, { useState } from 'react';
import { MessageSquare, Mail, Smartphone, Copy, Check, ExternalLink } from 'lucide-react';
import { copyToClipboard } from '../utils/googleReviewUrl';

interface ShareRequestTemplatesProps {
  businessName: string;
  reviewUrl: string;
}

export const ShareRequestTemplates: React.FC<ShareRequestTemplatesProps> = ({
  businessName,
  reviewUrl,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const name = businessName || 'our team';

  const templates = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Message',
      icon: MessageSquare,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      text: `Hi [Customer Name]! 😊 Thank you so much for visiting ${name} today. We hope you had a fantastic experience!\n\nIf you have 30 seconds, could you please leave us a quick review on Google? It really helps our local business:\n${reviewUrl}\n\nThank you so much for your support! ⭐⭐⭐⭐⭐`,
    },
    {
      id: 'sms',
      name: 'Direct SMS (Text Message)',
      icon: Smartphone,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      text: `Hi! Thank you for choosing ${name}. If you enjoyed our service, could you take 30 secs to leave a quick Google review? ${reviewUrl} - Thank you!`,
    },
    {
      id: 'email',
      name: 'Email Follow-up',
      icon: Mail,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      subject: `How was your visit to ${name}? We'd love your feedback!`,
      text: `Hi [Customer Name],\n\nThank you for stopping by ${name}! We hope everything met or exceeded your expectations.\n\nAs a local business, online reviews help others in our community find us. If you enjoyed your time with us, would you mind taking 30 seconds to share your review on Google?\n\n👉 Click here to leave a review: ${reviewUrl}\n\nThank you again for choosing us — we look forward to seeing you again soon!\n\nWarm regards,\nThe team at ${name}`,
    },
  ];

  const handleCopy = async (id: string, content: string) => {
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopiedType(id);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">
          Customer Review Request Templates
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
          Send these ready-to-use messages via SMS, WhatsApp, or Email to invite recent customers to leave a review.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${tpl.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{tpl.name}</span>
                  </div>
                </div>

                {tpl.subject && (
                  <div className="mb-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-500">Subject: </span>
                    <span className="text-slate-800 font-medium">{tpl.subject}</span>
                  </div>
                )}

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans max-h-56 overflow-y-auto">
                  {tpl.text}
                </div>
              </div>

              <div className="pt-4 mt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      tpl.id,
                      tpl.subject ? `Subject: ${tpl.subject}\n\n${tpl.text}` : tpl.text
                    )
                  }
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedType === tpl.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Template</span>
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
