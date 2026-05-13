'use client';

import { useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Upload, Download, FileText, FileImage, Type,
  ArrowRight, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';
import DownloadModal from '@/components/DownloadModal';

type ConversionTool =
  | 'word-to-pdf'
  | 'images-to-pdf'
  | 'pdf-to-jpg';

interface ConversionOption {
  id: ConversionTool;
  label: string;
  from: string;
  to: string;
  icon: React.ReactNode;
  accept: string;
  color: string;
  bgColor: string;
}

const conversionOptions: ConversionOption[] = [
  {
    id: 'word-to-pdf',
    label: 'Word to PDF',
    from: 'DOCX / DOC',
    to: 'PDF',
    icon: <Type className="w-6 h-6" />,
    accept: '.doc,.docx',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'images-to-pdf',
    label: 'Images to PDF',
    from: 'JPG / PNG / WEBP',
    to: 'PDF',
    icon: <FileImage className="w-6 h-6" />,
    accept: 'image/*',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'pdf-to-jpg',
    label: 'PDF to Images',
    from: 'PDF',
    to: 'JPG / PNG',
    icon: <FileText className="w-6 h-6" />,
    accept: '.pdf',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export default function ConverterPage() {
  const searchParams = useSearchParams();
  const initialTool = (searchParams.get('tool') as ConversionTool) || 'word-to-pdf';

  const [activeTool, setActiveTool] = useState<ConversionTool>(initialTool);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [showDownload, setShowDownload] = useState(false);
  const [downloadData, setDownloadData] = useState<{ bytes: Uint8Array; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentOption = conversionOptions.find((o) => o.id === activeTool)!;

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

  // Word to PDF: convert DOCX to HTML via mammoth, then render to PDF
  const convertWordToPdf = useCallback(async () => {
    if (files.length === 0) return;
    setLoading(true);
    setProgress('Reading Word document…');
    try {
      const mammoth = (await import('mammoth')).default;
      const jsPDF = (await import('jspdf')).jsPDF;

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        setProgress('Converting document content…');
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;

        setProgress('Generating PDF…');
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });

        // Use html plugin from jspdf
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:595px;font-family:Arial;font-size:12px;padding:40px;';
        tempDiv.innerHTML = html;
        document.body.appendChild(tempDiv);

        await doc.html(tempDiv, {
          callback: (d) => {
            document.body.removeChild(tempDiv);
            const pdfBytes = d.output('arraybuffer');
            triggerDownload(new Uint8Array(pdfBytes), file.name.replace(/\.docx?$/, '.pdf'));
          },
          x: 40,
          y: 40,
          width: 515,
          windowWidth: 595,
        });
      }
      toast.success('Conversion complete!');
    } catch (e) {
      console.error(e);
      toast.error('Conversion failed. Check that the file is a valid Word document.');
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
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          img = await doc.embedJpg(bytes);
        } else {
          img = await doc.embedPng(bytes);
        }

        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }

      const outBytes = await doc.save();
      triggerDownload(outBytes, 'images.pdf');
      toast.success(`Created PDF from ${files.length} image(s)`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to create PDF from images');
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

          canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace('.pdf', '')}-page${i}.jpg`;
            a.click();
            URL.revokeObjectURL(url);
          }, 'image/jpeg', 0.92);
        }
        toast.success(`Exported ${total} image(s) from ${file.name}`);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to convert PDF to images');
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
            className={`card flex items-start gap-3 text-left transition-all hover:shadow-md ${
              activeTool === opt.id ? 'border-blue-500 ring-2 ring-blue-100' : ''
            }`}
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
        <div
          onClick={() => fileInputRef.current?.click()}
          className="upload-zone mb-4 cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={currentOption.accept}
            multiple={activeTool === 'images-to-pdf'}
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
          <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
          <p className="text-slate-700 font-semibold mb-1">
            {activeTool === 'images-to-pdf' ? 'Upload images' : `Upload ${currentOption.from} file`}
          </p>
          <p className="text-slate-500 text-sm">
            Accepts: {currentOption.accept.replace(/\./g, '').toUpperCase()}
            {activeTool === 'images-to-pdf' && ' (you can select multiple)'}
          </p>
        </div>

        {files.length > 0 && (
          <div className="card mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Selected files</p>
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="truncate">{f.name}</span>
                </div>
                <span className="text-xs text-slate-400 ml-2 flex-shrink-0">{(f.size / 1024).toFixed(1)} KB</span>
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
          <span>All conversion is done locally in your browser. No files are sent to any server. Large files or complex Word documents with advanced formatting may have limited support.</span>
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
