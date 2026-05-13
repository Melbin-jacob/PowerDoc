'use client';

import Link from 'next/link';
import {
  FileText, Scissors, Layers, FileImage, Type,
  Shield, Zap, Lock, ArrowRight, Upload
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFileStore } from '@/store/fileStore';

const features = [
  { icon: <FileText className="w-6 h-6" />, title: 'Edit PDF', desc: 'Add text, images, annotations and signatures to any PDF.', href: '/editor', color: 'bg-blue-50 text-blue-600' },
  { icon: <Scissors className="w-6 h-6" />, title: 'Split PDF', desc: 'Extract specific pages or split a PDF into multiple files.', href: '/editor?tool=split', color: 'bg-orange-50 text-orange-600' },
  { icon: <Layers className="w-6 h-6" />, title: 'Merge PDFs', desc: 'Combine multiple PDF files into a single document.', href: '/editor?tool=merge', color: 'bg-purple-50 text-purple-600' },
  { icon: <FileImage className="w-6 h-6" />, title: 'PDF to Images', desc: 'Convert each PDF page to high-quality JPG or PNG images.', href: '/converter?tool=pdf-to-jpg', color: 'bg-green-50 text-green-600' },
  { icon: <Type className="w-6 h-6" />, title: 'Word to PDF', desc: 'Convert DOCX documents to PDF instantly.', href: '/converter?tool=word-to-pdf', color: 'bg-sky-50 text-sky-600' },
  { icon: <Zap className="w-6 h-6" />, title: 'Compress PDF', desc: 'Reduce PDF file size while keeping quality high.', href: '/editor?tool=compress', color: 'bg-yellow-50 text-yellow-600' },
];

const stats = [
  { value: '100%', label: 'Free, Always' },
  { value: '0 KB', label: 'Data Stored' },
  { value: 'Instant', label: 'Processing' },
  { value: 'Secure', label: 'Browser-Only' },
];

export default function HomePage() {
  const router = useRouter();
  const { setPendingFile } = useFileStore();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setPendingFile(file);
    if (file.type === 'application/pdf') {
      router.push('/editor');
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    ) {
      router.push('/converter?tool=word-to-pdf');
    } else {
      router.push('/converter');
    }
  }, [router, setPendingFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="text-center py-16 px-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-blue-100">
          <Shield className="w-4 h-4" /> 100% Free — No Sign-up — Files Never Stored
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-5">
          Edit & Convert<br />
          <span className="text-blue-600">PDFs in Seconds</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto mb-10">
          Powerful online PDF tools. Edit, merge, split, compress and convert documents — right in your browser. Nothing is uploaded to any server.
        </p>

        {/* Upload drop zone — use a real <label> so click always opens file dialog */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
          onDrop={onDrop}
          className={`upload-zone max-w-lg mx-auto ${dragging ? 'drag-over' : ''}`}
        >
          <input
            ref={inputRef}
            id="hero-upload"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <label htmlFor="hero-upload" className="cursor-pointer block">
            <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold text-lg mb-1">Drop your file here</p>
            <p className="text-slate-500 text-sm">PDF, Word, JPG, PNG — or click to browse</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['PDF', 'DOCX', 'JPG', 'PNG'].map((f) => (
                <span key={f} className="px-2 py-0.5 bg-white rounded-full text-xs font-mono text-slate-600 border border-slate-200">{f}</span>
              ))}
            </div>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/editor" className="btn-primary text-base px-6 py-3">
            Open PDF Editor <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/converter" className="btn-secondary text-base px-6 py-3">
            Convert Documents
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 px-4 mb-16">
        {stats.map((s) => (
          <div key={s.label} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-2xl font-extrabold text-blue-600">{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Feature grid */}
      <section className="px-4 mb-16">
        <h2 className="text-center text-2xl font-bold text-slate-800 mb-2">All the Tools You Need</h2>
        <p className="text-center text-slate-500 text-sm mb-8">No account, no limits, no catches.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {features.map((f) => (
            <Link key={f.title} href={f.href} className="card hover:shadow-md hover:border-blue-200 transition-all group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${f.color}`}>{f.icon}</div>
              <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Privacy notice */}
      <section className="max-w-2xl mx-auto px-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-12 h-12 flex-shrink-0 bg-green-100 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800 mb-1">Your Privacy is Protected</h3>
            <p className="text-sm text-green-700 leading-relaxed">
              All document processing happens <strong>entirely in your browser</strong>. We do not upload, store, or transmit your files to any server. Once you close the tab, all data is gone. Read our{' '}
              <Link href="/privacy" className="underline hover:text-green-900">Privacy Policy</Link> for full details.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
