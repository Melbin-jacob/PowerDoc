'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Upload, FileText, FileImage, Type,
  ArrowRight, CheckCircle2, AlertCircle, Loader2, Trash2
} from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import toast from 'react-hot-toast';
import DownloadModal from '@/components/DownloadModal';
import { useFileStore } from '@/store/fileStore';

type ConversionTool = 'word-to-pdf' | 'images-to-pdf' | 'pdf-to-jpg';

interface ConversionOption {
  id: ConversionTool;
  label: string;
  from: string;
  to: string;
  icon: React.ReactNode;
  accept: string;
  color: string;
  bgColor: string;
  multiple: boolean;
}

const conversionOptions: ConversionOption[] = [
  { id: 'word-to-pdf', label: 'Word to PDF', from: 'DOCX / DOC', to: 'PDF', icon: <Type className="w-6 h-6" />, accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', color: 'text-blue-600', bgColor: 'bg-blue-50', multiple: false },
  { id: 'images-to-pdf', label: 'Images to PDF', from: 'JPG / PNG / WEBP', to: 'PDF', icon: <FileImage className="w-6 h-6" />, accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp', color: 'text-green-600', bgColor: 'bg-green-50', multiple: true },
  { id: 'pdf-to-jpg', label: 'PDF to Images', from: 'PDF', to: 'JPG / PNG', icon: <FileText className="w-6 h-6" />, accept: '.pdf,application/pdf', color: 'text-orange-600', bgColor: 'bg-orange-50', multiple: false },
];

export default function ConverterPage() {
  const searchParams = useSearchParams();
  const initialTool = (searchParams.get('tool') as ConversionTool) || 'word-to-pdf';
  const { pendingFile, clearPendingFile } = useFileStore();

  const [activeTool, setActiveTool] = useState<ConversionTool>(initialTool);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [dragging, setDragging] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [downloadData, setDownloadData] = useState<{ bytes: Uint8Array; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentOption = conversionOptions.find((o) => o.id === activeTool)!;

  // Auto-load file passed from the home page
  useEffect(() => {
    if (pendingFile) {
      setFiles([pendingFile]);
      clearPendingFile();
    }
  }, [pendingFile, clearPendingFile]);

  const triggerDownload = useCallback((bytes: Uint8Array, name: string) => {
    setDownloadData({ bytes, name });
    setShowDownload(true);
  }, []);

  const executeDownload = useCallback(() => {
    if (!downloadData) return;
    const blob = new Blob([downloadData.bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadData.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [downloadData]);

  // Word to PDF: extract text via mammoth, lay it out with pdf-lib
  const convertWordToPdf = useCallback(async () => {
    if (files.length === 0) return;
    setLoading(true);
    setProgress('Reading Word document…');
    try {
      const mammoth = (await import('mammoth')).default;

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        setProgress('Extracting text…');
        const result = await mammoth.extractRawText({ arrayBuffer });
        const rawText = result.value;

        if (!rawText.trim()) {
          toast.error(`${file.name} appears to be empty or has no extractable text.`);
          continue;
        }

        setProgress('Building PDF…');
        const doc = await PDFDocument.create();
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

        const pageW = 595;   // A4 pt
        const pageH = 842;
        const margin = 55;
        const contentW = pageW - margin * 2;
        const fontSize = 11;
        const lineH = fontSize * 1.5;

        // Split raw text into paragraphs, then word-wrap each one
        const paragraphs = rawText.split(/\n+/);
        const lines: string[] = [];
        for (const para of paragraphs) {
          const trimmed = para.trim();
          if (!trimmed) { lines.push(''); continue; }
          // Word-wrap
          const words = trimmed.split(/\s+/);
          let current = '';
          for (const word of words) {
            const test = current ? `${current} ${word}` : word;
            if (font.widthOfTextAtSize(test, fontSize) > contentW && current) {
              lines.push(current);
              current = word;
            } else {
              current = test;
            }
          }
          if (current) lines.push(current);
          lines.push(''); // paragraph gap
        }

        let page = doc.addPage([pageW, pageH]);
        let y = pageH - margin;

        for (const line of lines) {
          if (y < margin + lineH) {
            page = doc.addPage([pageW, pageH]);
            y = pageH - margin;
          }
          if (line) {
            page.drawText(line, {
              x: margin,
              y,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });
          }
          y -= lineH;
        }

        // Embed file name as title metadata
        doc.setTitle(file.name.replace(/\.docx?$/i, ''));
        doc.setCreator('PowerDoc');

        const outBytes = await doc.save();
        triggerDownload(outBytes, file.name.replace(/\.docx?$/i, '.pdf'));
      }
      toast.success('Conversion complete!');
    } catch (e) {
      console.error(e);
      toast.error('Conversion failed. Make sure the file is a valid Word document.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  }, [files, triggerDownload]);

  // Images to PDF
  const convertImagesToPdf = useCallback(async () => {
    if (files.length === 0) return;
    setLoading(true);
    setProgress('Creating PDF from images…');
    try {
      const doc = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`Processing image ${i + 1} / ${files.length}…`);
        const bytes = new Uint8Array(await file.arrayBuffer());

        let img;
        if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.name.match(/\.jpe?g$/i)) {
          img = await doc.embedJpg(bytes);
        } else {
          img = await doc.embedPng(bytes);
        }

        // Scale down to A4 if larger
        const maxW = 595;
        const maxH = 842;
        let { width, height } = img;
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        const page = doc.addPage([width, height]);
        page.drawImage(img, { x: 0, y: 0, width, height });
      }

      const outBytes = await doc.save();
      triggerDownload(outBytes, 'images.pdf');
      toast.success(`Created PDF from ${files.length} image(s)`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to create PDF from images. Make sure all files are valid JPEG or PNG images.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  }, [files, triggerDownload]);

  // PDF to images
  const convertPdfToImages = useCallback(async () => {
    if (files.length === 0) return;
    setLoading(true);
    setProgress('Loading PDF…');
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      for (const file of files) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const total = pdf.numPages;

        for (let i = 1; i <= total; i++) {
          setProgress(`Rendering page ${i} / ${total}…`);
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (page.render as any)({ canvasContext: canvas.getContext('2d')!, viewport }).promise;

          await new Promise<void>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${file.name.replace(/\.pdf$/i, '')}-page${i}.jpg`;
                a.click();
                URL.revokeObjectURL(url);
              }
              resolve();
            }, 'image/jpeg', 0.92);
          });
        }
        toast.success(`Exported ${total} image(s) from ${file.name}`);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to convert PDF to images.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  }, [files]);

  const handleConvert = useCallback(async () => {
    if (activeTool === 'word-to-pdf') await convertWordToPdf();
    else if (activeTool === 'images-to-pdf') await convertImagesToPdf();
    else if (activeTool === 'pdf-to-jpg') await convertPdfToImages();
  }, [activeTool, convertWordToPdf, convertImagesToPdf, convertPdfToImages]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) {
      setFiles(currentOption.multiple ? (prev) => [...prev, ...dropped] : [dropped[0]]);
    }
  }, [currentOption.multiple]);

  return (
    <div className="pb-20 px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Document Converter</h1>
      <p className="text-slate-500 text-sm mb-6">Convert documents between formats — all processing happens in your browser.</p>

      {/* Conversion type selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {conversionOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => { setActiveTool(opt.id); setFiles([]); }}
            className={`card flex items-start gap-3 text-left transition-all hover:shadow-md ${activeTool === opt.id ? 'border-blue-500 ring-2 ring-blue-100' : ''}`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${opt.bgColor} ${opt.color}`}>
              {opt.icon}
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-sm">{opt.label}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <span>{opt.from}</span>
                <ArrowRight className="w-3 h-3" />
                <span>{opt.to}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Upload + convert */}
      <div className="max-w-xl mx-auto">
        {/* Drop zone using <label> for reliable click */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
          onDrop={onDrop}
          className={`mb-4 ${dragging ? 'drag-over' : ''}`}
        >
          <input
            ref={fileInputRef}
            id="converter-upload"
            type="file"
            accept={currentOption.accept}
            multiple={currentOption.multiple}
            className="hidden"
            onChange={(e) => {
              const selected = Array.from(e.target.files || []);
              if (selected.length > 0) {
                setFiles(currentOption.multiple ? (prev) => [...prev, ...selected] : [selected[0]]);
              }
            }}
          />
          <label
            htmlFor="converter-upload"
            className={`upload-zone cursor-pointer block ${dragging ? 'drag-over' : ''}`}
          >
            <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold mb-1">
              {currentOption.multiple ? 'Upload images' : `Upload ${currentOption.from} file`}
            </p>
            <p className="text-slate-500 text-sm">
              Click to browse or drag & drop{currentOption.multiple ? ' (multiple files allowed)' : ''}
            </p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="card mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Selected files</p>
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2 text-sm text-slate-700 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="truncate">{f.name}</span>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className="text-xs text-slate-400">{(f.size / 1024).toFixed(1)} KB</span>
                  <button
                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="text-red-400 hover:text-red-600"
                    aria-label="Remove file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && progress && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
            <span className="text-sm text-blue-700">{progress}</span>
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={files.length === 0 || loading}
          className="btn-primary w-full justify-center py-3 text-base"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Converting…</>
          ) : (
            <><ArrowRight className="w-5 h-5" /> Convert {currentOption.from} → {currentOption.to}</>
          )}
        </button>

        <div className="mt-4 flex items-start gap-2 text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>All conversion is done locally in your browser. No files are sent to any server. Word documents with complex formatting (tables, images, charts) will be converted as plain text.</span>
        </div>
      </div>

      {showDownload && downloadData && (
        <DownloadModal
          fileName={downloadData.name}
          onDownload={executeDownload}
          onClose={() => setShowDownload(false)}
        />
      )}
    </div>
  );
}
