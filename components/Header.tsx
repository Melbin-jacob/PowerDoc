'use client';

import Link from 'next/link';
import { useState, useId, useEffect, useRef } from 'react';
import { FileText, Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsMenuId = useId();
  const mobileMenuId = useId();
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setToolsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Click outside Tools dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tools = [
    { href: '/editor', label: 'PDF Editor', desc: 'Edit, annotate & organize PDFs' },
    { href: '/converter', label: 'Document Converter', desc: 'Convert between formats' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <FileText className="w-6 h-6" />
            <span>PowerDoc</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <div className="relative" ref={toolsDropdownRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                aria-haspopup="true"
                aria-expanded={toolsOpen}
                aria-controls={toolsMenuId}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium text-sm transition-colors"
              >
                Tools <ChevronDown className="w-4 h-4" />
              </button>
              {toolsOpen && (
                <div
                  id={toolsMenuId}
                  role="menu"
                  className="absolute left-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  {tools.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      role="menuitem"
                      onClick={() => setToolsOpen(false)}
                      className="block px-4 py-3 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-slate-800 text-sm">{t.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/privacy" className="px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium text-sm transition-colors">
              Terms
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/editor" className="btn-primary text-sm py-2 px-4">
              Get Started Free
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-controls={mobileMenuId}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id={mobileMenuId}
          role="menu"
          className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2"
        >
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 font-medium text-sm"
            >
              {t.label}
            </Link>
          ))}
          <Link href="/privacy" role="menuitem" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 text-sm">Privacy Policy</Link>
          <Link href="/terms" role="menuitem" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 text-sm">Terms of Service</Link>
          <div className="pt-2" role="none">
            <Link href="/editor" role="menuitem" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center">
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
