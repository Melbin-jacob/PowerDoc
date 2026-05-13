'use client';

import { useAdminStore } from '@/store/adminStore';

interface AdSlotProps {
  position: 'top' | 'left' | 'right' | 'inline';
  className?: string;
}

const dimensions: Record<AdSlotProps['position'], { width: string; height: string; label: string }> = {
  top:    { width: '100%',  height: '90px',   label: 'Top Banner — 728×90' },
  left:   { width: '160px', height: '600px',  label: 'Left Sidebar\n160×600' },
  right:  { width: '160px', height: '600px',  label: 'Right Sidebar\n160×600' },
  inline: { width: '100%',  height: '90px',   label: 'Inline Banner — 468×60' },
};

export default function AdSlot({ position, className = '' }: AdSlotProps) {
  const { topBannerEnabled, sidebarAdsEnabled, topBannerCode, leftAdCode, rightAdCode } = useAdminStore();

  const isVisible =
    (position === 'top' && topBannerEnabled) ||
    ((position === 'left' || position === 'right') && sidebarAdsEnabled) ||
    position === 'inline';

  if (!isVisible) return null;

  const dim = dimensions[position];
  const customCode =
    position === 'top' ? topBannerCode :
    position === 'left' ? leftAdCode :
    position === 'right' ? rightAdCode : '';

  if (customCode) {
    return (
      <div
        className={className}
        style={{ width: dim.width, minHeight: dim.height }}
        dangerouslySetInnerHTML={{ __html: customCode }}
      />
    );
  }

  return (
    <div
      className={`ad-slot ${className}`}
      style={{ width: dim.width, minHeight: dim.height }}
    >
      <span className="mt-4 whitespace-pre-line text-xs text-slate-400">{dim.label}</span>
    </div>
  );
}
