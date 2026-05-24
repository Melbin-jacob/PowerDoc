'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Download, X, Clock } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

interface DownloadModalProps {
  fileName: string;
  onDownload: () => void;
  onClose: () => void;
}

export default function DownloadModal({ fileName, onDownload, onClose }: DownloadModalProps) {
  const { adBeforeDownload, adDuration } = useAdminStore();
  const [secondsLeft, setSecondsLeft] = useState(adDuration);
  const [canDownload, setCanDownload] = useState(!adBeforeDownload);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (canDownload && downloadButtonRef.current) {
      downloadButtonRef.current.focus();
    }
  }, [canDownload]);

  useEffect(() => {
    if (!adBeforeDownload) {
      return;
    }

    // Initialize countdown
    setSecondsLeft(adDuration);
    setCanDownload(false);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          setCanDownload(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [adBeforeDownload, adDuration]);

  const handleDownload = useCallback(() => {
    if (!canDownload) return;
    onDownload();
    onClose();
  }, [canDownload, onDownload, onClose]);

  const circumference = 2 * Math.PI * 44;
  const progress = adBeforeDownload ? (adDuration - secondsLeft) / adDuration : 1;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div id="modal-title" className="flex items-center gap-2 font-semibold text-slate-800">
            <Download className="w-5 h-5 text-blue-600" aria-hidden="true" />
            Download File
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Ad area */}
        {adBeforeDownload && !canDownload && (
          <div className="px-6 pt-5">
            <div
              className="ad-slot rounded-xl"
              style={{ height: '200px', width: '100%' }}
            >
              <div className="flex flex-col items-center gap-2 mt-6">
                <span className="text-slate-400 text-xs uppercase tracking-widest">Advertisement</span>
                <span className="text-slate-300 text-xs">Your ad content here</span>
                <span className="text-slate-300 text-xs">(Replace with Google AdSense or custom HTML)</span>
              </div>
            </div>
          </div>
        )}

        {/* Countdown / ready */}
        <div className="px-6 py-6 flex flex-col items-center gap-4">
          {adBeforeDownload && !canDownload ? (
            <>
              <div className="relative w-28 h-28">
                <svg width="112" height="112" viewBox="0 0 112 112">
                  {/* Background ring */}
                  <circle cx="56" cy="56" r="44" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  {/* Progress ring */}
                  <circle
                    cx="56" cy="56" r="44"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="countdown-ring transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-500 mb-1" />
                  <span className="text-2xl font-bold text-slate-800">{secondsLeft}</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm text-center">
                Your free download will be ready in <strong>{secondsLeft}s</strong>.
                <br />
                <span className="text-slate-400 text-xs">Please wait for the ad to complete.</span>
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-slate-700 font-medium text-center">Ready to download!</p>
              <p className="text-xs text-slate-500 text-center break-all max-w-xs">{fileName}</p>
            </div>
          )}

          <button
            ref={downloadButtonRef}
            onClick={handleDownload}
            disabled={!canDownload}
            className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              canDownload
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            {canDownload ? `Download ${fileName}` : `Download available in ${secondsLeft}s`}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Ads keep PowerDoc free for everyone. Thank you for your patience.
          </p>
        </div>
      </div>
    </div>
  );
}
