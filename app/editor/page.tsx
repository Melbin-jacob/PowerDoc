'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Upload, Download, RotateCw, RotateCcw, Trash2, Plus,
  Layers, Scissors, Zap, Type, ChevronLeft, ChevronRight,
  FileText, AlertCircle
} from 'lucide-react';
import { PDFDocument, degrees, rgb } from 'pdf-lib';
import toast from 'react-hot-toast';
import DownloadModal from '@/components/DownloadModal';

type Tool = 'view' | 'text' | 'merge' | 'split' | 'compress' | 'rotate';

interface PageInfo {
  index: number;
  rotation: number;
  selected: boolean;
}

export default function EditorPage() {
  const searchParams = useSearchParams();
  const initialTool = (searchParams.get('tool') as Tool) || 'view';

  const [activeTool, setActiveTool] = useState<Tool>(initialTool);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [fileName, setFileName] = useState('document.pdf');
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [addText, setAddText] = useState('');
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(50);
  const [textSize, setTextSize] = useState(16);
  const [splitPages, setSplitPages] = useState('');
  const [showDownload, setShowDownload] = useState(false);
  const [downloadData, setDownloadData] = useState<{ bytes: Uint8Array; name: string } | null>(null);
  const [renderError, setRenderError] = useState(false);
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarFileInputRef = useRef<HTMLInputElement>(null);
  const mergeInputRef = useRef<HTMLInputElement>(null);

  const loadPDF = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    setLoading(true);
    setRenderError(false);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      setPdfBytes(bytes);
      setPdfDoc(doc);
      setFileName(file.name);
      setPages(doc.getPages().map((_, i) => ({ index: i, rotation: 0, selected: false })));
      setCurrentPage(0);
      toast.success(`Loaded ${file.name} — ${doc.getPageCount()} page(s)`);
    } catch {
      toast.error('Failed to load PDF. The file may be corrupted or password-protected.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Render current page to canvas using pdf.js
  useEffect(() => {
    if (!pdfBytes) return;

    // Wait one tick so the canvas element is guaranteed to be in the DOM
    const timer = setTimeout(async () => {
      if (!canvasRef.current) return;
      setRenderError(false);

      try {
        const pdfjsLib = await import('pdfjs-dist');
        // Use the locally hosted worker — no CDN dependency
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes.slice() });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(currentPage + 1);

        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (page.render as any)({
          canvasContext: canvas.getContext('2d')!,
          viewport,
        }).promise;
      } catch (e) {
        console.error('Render error', e);
        setRenderError(true);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [pdfBytes, currentPage]);

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

  // --- Tool: Apply text ---
  const applyText = useCallback(async () => {
    if (!pdfDoc || !addText.trim()) return;
    setLoading(true);
    try {
      const doc = await PDFDocument.load(await pdfDoc.save());
      const page = doc.getPages()[currentPage];
      const { height } = page.getSize();
      page.drawText(addText, {
        x: textX,
        y: height - textY - textSize,
        size: textSize,
        color: rgb(0, 0, 0),
      });
      const newBytes = await doc.save();
      const newDoc = await PDFDocument.load(newBytes);
      setPdfBytes(newBytes);
      setPdfDoc(newDoc);
      setAddText('');
      toast.success('Text added!');
    } catch {
      toast.error('Failed to add text');
    } finally {
      setLoading(false);
    }
  }, [pdfDoc, addText, currentPage, textX, textY, textSize]);

  // --- Tool: Rotate ---
  const rotatePage = useCallback(async (direction: 'cw' | 'ccw') => {
    if (!pdfDoc) return;
    setLoading(true);
    try {
      const doc = await PDFDocument.load(await pdfDoc.save());
      const page = doc.getPages()[currentPage];
      const current = page.getRotation().angle;
      page.setRotation(degrees(current + (direction === 'cw' ? 90 : -90)));
      const newBytes = await doc.save();
      setPdfBytes(newBytes);
      setPdfDoc(await PDFDocument.load(newBytes));
      toast.success('Page rotated');
    } catch {
      toast.error('Rotation failed');
    } finally {
      setLoading(false);
    }
  }, [pdfDoc, currentPage]);

  // --- Tool: Delete page ---
  const deletePage = useCallback(async () => {
    if (!pdfDoc) return;
    if (pdfDoc.getPageCount() <= 1) { toast.error('Cannot delete the only page'); return; }
    setLoading(true);
    try {
      const doc = await PDFDocument.load(await pdfDoc.save());
      doc.removePage(currentPage);
      const newBytes = await doc.save();
      const newDoc = await PDFDocument.load(newBytes);
      setPdfBytes(newBytes);
      setPdfDoc(newDoc);
      setPages(newDoc.getPages().map((_, i) => ({ index: i, rotation: 0, selected: false })));
      setCurrentPage((p) => Math.min(p, newDoc.getPageCount() - 1));
      toast.success('Page deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setLoading(false);
    }
  }, [pdfDoc, currentPage]);

  // --- Tool: Merge ---
  const mergePDFs = useCallback(async () => {
    if (mergeFiles.length < 2) { toast.error('Add at least 2 PDF files to merge'); return; }
    setLoading(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of mergeFiles) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const doc = await PDFDocument.load(bytes);
        const copiedPages = await merged.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((p) => merged.addPage(p));
      }
      const newBytes = await merged.save();
      const newDoc = await PDFDocument.load(newBytes);
      setPdfBytes(newBytes);
      setPdfDoc(newDoc);
      setFileName('merged.pdf');
      setPages(newDoc.getPages().map((_, i) => ({ index: i, rotation: 0, selected: false })));
      setCurrentPage(0);
      setMergeFiles([]);
      toast.success(`Merged ${mergeFiles.length} PDFs — ${newDoc.getPageCount()} pages total`);
    } catch {
      toast.error('Merge failed');
    } finally {
      setLoading(false);
    }
  }, [mergeFiles]);

  // --- Tool: Split ---
  const splitPDF = useCallback(async () => {
    if (!pdfDoc) return;
    const total = pdfDoc.getPageCount();
    const nums = splitPages.split(',').map((s) => parseInt(s.trim(), 10) - 1).filter((n) => n >= 0 && n < total);
    if (nums.length === 0) { toast.error('Enter valid page numbers (e.g. 1,3,5)'); return; }
    setLoading(true);
    try {
      const bytes = await pdfDoc.save();
      for (let i = 0; i < nums.length; i++) {
        const doc = await PDFDocument.create();
        const src = await PDFDocument.load(bytes);
        const [page] = await doc.copyPages(src, [nums[i]]);
        doc.addPage(page);
        const outBytes = await doc.save();
        const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName.replace('.pdf', '')}-page${nums[i] + 1}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
      toast.success(`Split into ${nums.length} file(s)`);
    } catch {
      toast.error('Split failed');
    } finally {
      setLoading(false);
    }
  }, [pdfDoc, splitPages, fileName]);

  // --- Tool: Compress (re-save strips some metadata) ---
  const compressPDF = useCallback(async () => {
    if (!pdfDoc) return;
    setLoading(true);
    try {
      const bytes = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
      const compressed = await PDFDocument.load(bytes);
      const outBytes = await compressed.save({ useObjectStreams: true });
      triggerDownload(outBytes, fileName.replace('.pdf', '-compressed.pdf'));
    } catch {
      toast.error('Compression failed');
    } finally {
      setLoading(false);
    }
  }, [pdfDoc, fileName, triggerDownload]);

  const downloadCurrent = useCallback(async () => {
    if (!pdfDoc) return;
    const bytes = await pdfDoc.save();
    triggerDownload(bytes, fileName);
  }, [pdfDoc, fileName, triggerDownload]);

  const tools: { id: Tool; label: string; icon: React.ReactNode }[] = [
    { id: 'view', label: 'View & Edit', icon: <FileText className="w-4 h-4" /> },
    { id: 'text', label: 'Add Text', icon: <Type className="w-4 h-4" /> },
    { id: 'rotate', label: 'Rotate', icon: <RotateCw className="w-4 h-4" /> },
    { id: 'merge', label: 'Merge', icon: <Layers className="w-4 h-4" /> },
    { id: 'split', label: 'Split', icon: <Scissors className="w-4 h-4" /> },
    { id: 'compress', label: 'Compress', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">PDF Editor</h1>
        <p className="text-slate-500 text-sm mb-6">All processing is done locally in your browser. Your files are never uploaded.</p>

        {/* Upload area */}
        {!pdfDoc && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) loadPDF(file);
            }}
            className={`upload-zone max-w-xl mx-auto mb-8 cursor-pointer ${dragging ? 'drag-over' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) loadPDF(e.target.files[0]); }}
            />
            <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold mb-1">Upload a PDF to get started</p>
            <p className="text-slate-500 text-sm">Click to browse or drag & drop your PDF here</p>
          </div>
        )}

        {pdfDoc && (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Sidebar tools */}
            <div className="lg:w-56 flex-shrink-0">
              <div className="card p-2 mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2 mb-2">Tools</p>
                {tools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTool(t.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                      activeTool === t.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* File info */}
              <div className="card p-3 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium text-slate-700 mb-2 truncate">
                  <FileText className="w-4 h-4 flex-shrink-0 text-blue-500" />
                  <span className="truncate">{fileName}</span>
                </div>
                <p>{pdfDoc.getPageCount()} page(s)</p>
                <button
                  onClick={() => sidebarFileInputRef.current?.click()}
                  className="mt-3 w-full text-blue-600 hover:text-blue-800 flex items-center gap-1 justify-center text-xs font-medium"
                >
                  <Upload className="w-3 h-3" /> Load new file
                </button>
                <input
                  ref={sidebarFileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) loadPDF(e.target.files[0]); }}
                />
              </div>
            </div>

            {/* Main area */}
            <div className="flex-1 min-w-0">
              {/* Tool panels */}
              {activeTool === 'text' && (
                <div className="card mb-4">
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><Type className="w-4 h-4 text-blue-500" /> Add Text to Page {currentPage + 1}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-xs text-slate-500 mb-1 block">Text content</label>
                      <input
                        type="text"
                        value={addText}
                        onChange={(e) => setAddText(e.target.value)}
                        placeholder="Enter text to add..."
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">X position (px from left)</label>
                      <input type="number" value={textX} onChange={(e) => setTextX(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Y position (px from top)</label>
                      <input type="number" value={textY} onChange={(e) => setTextY(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Font size</label>
                      <input type="number" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} min={8} max={72} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-end">
                      <button onClick={applyText} disabled={!addText.trim() || loading} className="btn-primary w-full justify-center py-2">
                        Apply Text
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTool === 'rotate' && (
                <div className="card mb-4">
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><RotateCw className="w-4 h-4 text-blue-500" /> Rotate Page {currentPage + 1}</h3>
                  <div className="flex gap-3">
                    <button onClick={() => rotatePage('ccw')} className="btn-secondary flex-1 justify-center">
                      <RotateCcw className="w-4 h-4" /> Rotate Left 90°
                    </button>
                    <button onClick={() => rotatePage('cw')} className="btn-secondary flex-1 justify-center">
                      <RotateCw className="w-4 h-4" /> Rotate Right 90°
                    </button>
                  </div>
                  <button onClick={deletePage} disabled={loading} className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete This Page
                  </button>
                </div>
              )}

              {activeTool === 'merge' && (
                <div className="card mb-4">
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-blue-500" /> Merge PDFs</h3>
                  <p className="text-xs text-slate-500 mb-3">Add multiple PDF files to merge them into one document.</p>
                  <div
                    onClick={() => mergeInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <input
                      ref={mergeInputRef}
                      type="file"
                      accept=".pdf"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setMergeFiles((prev) => [...prev, ...files]);
                      }}
                    />
                    <Plus className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Click to add PDF files</p>
                  </div>
                  {mergeFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {mergeFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                          <span className="text-xs text-slate-600 truncate flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-blue-500" /> {f.name}
                          </span>
                          <button onClick={() => setMergeFiles((prev) => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 ml-2">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={mergePDFs}
                    disabled={mergeFiles.length < 2 || loading}
                    className="btn-primary mt-4 w-full justify-center"
                  >
                    <Layers className="w-4 h-4" /> Merge {mergeFiles.length} Files
                  </button>
                </div>
              )}

              {activeTool === 'split' && (
                <div className="card mb-4">
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><Scissors className="w-4 h-4 text-blue-500" /> Split PDF ({pdfDoc.getPageCount()} pages)</h3>
                  <p className="text-xs text-slate-500 mb-3">Enter page numbers to extract as separate PDFs (comma-separated).</p>
                  <input
                    type="text"
                    value={splitPages}
                    onChange={(e) => setSplitPages(e.target.value)}
                    placeholder={`e.g. 1,3,5 (max page: ${pdfDoc.getPageCount()})`}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  />
                  <button onClick={splitPDF} disabled={!splitPages || loading} className="btn-primary w-full justify-center">
                    <Scissors className="w-4 h-4" /> Split & Download Pages
                  </button>
                </div>
              )}

              {activeTool === 'compress' && (
                <div className="card mb-4">
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> Compress PDF</h3>
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700">This applies lossless compression by optimising the PDF structure. For image-heavy PDFs, use dedicated image compression tools for maximum reduction.</p>
                  </div>
                  <button onClick={compressPDF} disabled={loading} className="btn-primary w-full justify-center">
                    <Zap className="w-4 h-4" /> Compress & Download
                  </button>
                </div>
              )}

              {/* PDF Preview */}
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-700">Preview</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 text-slate-600"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-slate-600 min-w-[80px] text-center">
                      Page {currentPage + 1} / {pdfDoc.getPageCount()}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(pdfDoc.getPageCount() - 1, p + 1))}
                      disabled={currentPage === pdfDoc.getPageCount() - 1}
                      className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 text-slate-600"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button onClick={downloadCurrent} className="btn-primary py-1.5 px-3 text-xs ml-2">
                      <Download className="w-3.5 h-3.5" /> Save PDF
                    </button>
                  </div>
                </div>
                <div className="overflow-auto bg-slate-100 rounded-xl flex justify-center p-4 min-h-[400px]">
                  {loading ? (
                    <div className="flex items-center gap-2 text-slate-400 self-center">
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      Processing…
                    </div>
                  ) : renderError ? (
                    <div className="flex flex-col items-center gap-3 self-center text-center px-6">
                      <AlertCircle className="w-10 h-10 text-amber-400" />
                      <p className="text-slate-600 font-medium">Preview unavailable</p>
                      <p className="text-sm text-slate-400">The PDF loaded successfully — you can still edit and download it. Preview rendering requires a modern browser.</p>
                    </div>
                  ) : (
                    <canvas ref={canvasRef} className="shadow-xl max-w-full rounded" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page thumbnail strip */}
        {pdfDoc && pages.length > 1 && (
          <div className="mt-4 card">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Pages ({pages.length})</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {pages.map((p) => (
                <button
                  key={p.index}
                  onClick={() => setCurrentPage(p.index)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-colors ${
                    currentPage === p.index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <div className="w-16 h-20 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-400 text-xs">
                    {p.index + 1}
                  </div>
                  <span className="text-xs text-slate-500">p.{p.index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        )}
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
