import { Suspense } from 'react';

export default function ConverterLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-400">Loading converter…</div>}>{children}</Suspense>;
}
