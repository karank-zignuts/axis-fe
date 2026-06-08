import type { ReactNode } from 'react';

export function ScribbleUnderline({ children }: { children: ReactNode }) {
  return (
    <span className="scribble-underline">
      {children}
      <svg viewBox="0 0 200 14" preserveAspectRatio="none" fill="none">
        <path
          d="M2 9 C 40 2, 80 14, 120 6 S 190 4, 198 10"
          stroke="hsl(var(--accent))"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function HandArrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" aria-hidden>
      <path
        d="M8 12 C 30 8, 60 18, 78 42 C 86 54, 90 64, 92 72"
        stroke="hsl(var(--accent))"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M82 60 L 92 72 L 104 64"
        stroke="hsl(var(--accent))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HandNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`hand text-xl leading-tight ${className}`}>{children}</span>;
}
