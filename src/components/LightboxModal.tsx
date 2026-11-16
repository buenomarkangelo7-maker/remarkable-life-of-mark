import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ResilientImage } from './ResilientImage';

export interface LightboxImageItem {
  id?: string;
  url: string;
  title?: string;
  caption?: string;
  description?: string;
  date_taken?: string;
  location?: string;
  category?: string;
}

interface LightboxModalProps {
  items: LightboxImageItem[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
}

export function LightboxModal({
  items,
  activeIndex,
  onClose,
  onChangeIndex,
}: LightboxModalProps) {
  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < items.length;
  const current = isOpen ? items[activeIndex] : null;

  useEffect(() => {
    if (!isOpen || activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight' && items.length > 1) {
        onChangeIndex((activeIndex + 1) % items.length);
      } else if (event.key === 'ArrowLeft' && items.length > 1) {
        onChangeIndex((activeIndex - 1 + items.length) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, activeIndex, items.length, onClose, onChangeIndex]);

  if (!isOpen || !current || activeIndex === null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.title || current.caption || 'Photograph viewer'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C140F]/92 backdrop-blur-sm p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#E3DACD] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EAE1D4] bg-[#FAF7F2]">
          <div className="min-w-0 pr-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#8A7768] truncate">
              {[current.category, current.date_taken, current.location]
                .filter(Boolean)
                .join(' · ') || 'Personal Archive'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {items.length > 1 && (
              <span className="text-xs tabular-nums text-[#7C6A5C]">
                {activeIndex + 1} / {items.length}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photograph viewer"
              className="p-2 rounded-lg text-[#3D2E25] hover:bg-[#EAE1D4] transition-colors focus-visible:outline-2 focus-visible:outline-[#7C4A2D]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 bg-[#18120E] flex items-center justify-center min-h-[260px] max-h-[62vh] overflow-hidden">
          <ResilientImage
            src={current.url}
            alt={current.caption || current.title || 'Autobiography photograph'}
            className="max-h-[62vh] w-auto max-w-full object-contain"
          />

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => onChangeIndex((activeIndex - 1 + items.length) % items.length)}
                aria-label="Previous photograph"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#FAF7F2]/90 text-[#241B15] hover:bg-white transition-colors shadow-md focus-visible:outline-2 focus-visible:outline-[#7C4A2D]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onChangeIndex((activeIndex + 1) % items.length)}
                aria-label="Next photograph"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#FAF7F2]/90 text-[#241B15] hover:bg-white transition-colors shadow-md focus-visible:outline-2 focus-visible:outline-[#7C4A2D]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        <div className="px-6 py-5 bg-[#FFFDF9] border-t border-[#EAE1D4] overflow-y-auto">
          {current.title && (
            <h3 className="font-editorial text-2xl font-semibold text-[#241B15]">
              {current.title}
            </h3>
          )}
          {current.caption && (
            <p className="mt-1 text-sm sm:text-base text-[#4A3B31] font-medium">
              {current.caption}
            </p>
          )}
          {current.description && (
            <p className="mt-2 text-sm text-[#6E5C4E] leading-relaxed">
              {current.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
