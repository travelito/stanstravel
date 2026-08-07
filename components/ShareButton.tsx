"use client";

import { useState } from "react";

export function ShareButton({ label }: { label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the native share sheet — do nothing
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — silently ignore, button just won't confirm
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-ink/15 text-ink/60 hover:text-turquoise hover:border-turquoise transition-colors"
    >
      {copied ? (
        <span className="text-[10px] font-mono">✓</span>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
          <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
        </svg>
      )}
    </button>
  );
}
