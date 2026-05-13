import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSlot from '@/components/AdSlot';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'PowerDoc — Free PDF Editor & Document Converter',
  description:
    'Edit, convert, merge, split, and compress PDF documents online for free. No signup required. Files are never stored on our servers.',
  keywords: 'pdf editor, pdf converter, pdf to word, word to pdf, merge pdf, split pdf, compress pdf, free online',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased">
        <Toaster position="top-right" />

        {/* Top ad banner */}
        <div className="w-full flex justify-center bg-slate-50 border-b border-slate-100 py-2 px-4">
          <AdSlot position="top" />
        </div>

        <Header />

        {/* Main content with side ads */}
        <div className="flex flex-1 max-w-[1400px] mx-auto w-full px-2 gap-4 mt-6">
          {/* Left sidebar ad */}
          <aside className="hidden xl:flex flex-col items-center pt-2 flex-shrink-0">
            <AdSlot position="left" />
          </aside>

          {/* Page content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

          {/* Right sidebar ad */}
          <aside className="hidden xl:flex flex-col items-center pt-2 flex-shrink-0">
            <AdSlot position="right" />
          </aside>
        </div>

        <Footer />
      </body>
    </html>
  );
}
