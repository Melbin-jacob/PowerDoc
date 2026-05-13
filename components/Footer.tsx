import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <FileText className="w-5 h-5 text-blue-400" />
              PowerDoc
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Free online PDF editor and document converter. Upload, edit, and download — no account required. Your files stay private.
            </p>
            <p className="text-xs mt-4 text-slate-500">
              Files are processed in your browser and are never stored on our servers.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/editor" className="hover:text-white transition-colors">PDF Editor</Link></li>
              <li><Link href="/converter" className="hover:text-white transition-colors">Document Converter</Link></li>
              <li><Link href="/editor#merge" className="hover:text-white transition-colors">Merge PDFs</Link></li>
              <li><Link href="/editor#split" className="hover:text-white transition-colors">Split PDF</Link></li>
              <li><Link href="/editor#compress" className="hover:text-white transition-colors">Compress PDF</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/terms#disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/terms#cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PowerDoc. All rights reserved.</p>
          <p>By using this service, you agree to our <Link href="/terms" className="hover:text-white underline">Terms</Link> and <Link href="/privacy" className="hover:text-white underline">Privacy Policy</Link>.</p>
        </div>
      </div>
    </footer>
  );
}
