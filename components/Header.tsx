'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useId } from 'react';
import { FileText, Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const toolsId = useId();
  const mobileMenuId = useId();
  const toolsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (toolsOpen && toolsRef.current && !toolsRef.current.contains(target)) {
        setToolsOpen(false);
      }
      if (menuOpen &&
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(target) &&
          mobileMenuBtnRef.current &&
          !mobileMenuBtnRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setToolsOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [toolsOpen, menuOpen]);

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
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                aria-expanded={toolsOpen}
                aria-haspopup="true"
                aria-controls={toolsId}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium text-sm transition-colors"
              >
                Tools <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {toolsOpen && (
                <div
                  id={toolsId}
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
            ref={mobileMenuBtnRef}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls={mobileMenuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id={mobileMenuId}
          ref={mobileMenuRef}
          className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2"
        >
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 font-medium text-sm"
            >
              {t.label}
            </Link>
          ))}
          <Link href="/privacy" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 text-sm">Privacy Policy</Link>
          <Link href="/terms" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 text-sm">Terms of Service</Link>
          <div className="pt-2">
            <Link href="/editor" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center">
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
