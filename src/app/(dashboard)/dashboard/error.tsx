'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#161614] p-12 text-center text-[#f1efe8]">
      <div className="mb-6 rounded-full border border-red-500/30 bg-red-500/10 p-4">
        <svg
          className="h-10 w-10 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-bold uppercase tracking-tight text-[#f1efe8]">
        DASHBOARD ERROR<span className="text-[#d8763d]">.</span>
      </h2>
      <p className="mb-6 max-w-md text-xs font-mono text-[#f1efe8]/60">
        We couldn&apos;t load the requested telemetry data. Please retry or reload the platform overview.
      </p>
      <div className="flex gap-3 font-mono text-xs">
        <Button onClick={() => reset()}>Retry ↗</Button>
        <Button variant="outline" onClick={() => (window.location.href = '/dashboard')}>
          Dashboard Home
        </Button>
      </div>
    </div>
  );
}
