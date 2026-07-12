"use client";

import { useState } from "react";

export function EmailButton({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 미지원·거부 시 무시
    }
  };
  return (
    <button type="button" onClick={copy} aria-live="polite" className={className}>
      {copied ? "복사됨!" : "Email"}
    </button>
  );
}
