import { useEffect, useMemo, useState } from 'react';
import { Calendar, Camera, Grid, LayoutGrid, MapPin } from 'lucide-react';
import { LightboxModal } from '../components/LightboxModal';
import { ResilientImage } from '../components/ResilientImage';
import { useContent } from '../context/ContentContext';
import { PHOTO_CATEGORIES } from '../types/autobiography';

export function GalleryPage() {
  const { bundle } = useContent();
  const { photos, settings } = bundle;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [layoutMode, setLayoutMode] = useState<'masonry' | 'grid'>('masonry');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = `Personal Photo Gallery – ${settings.site_title}`;
  }, [settings.site_title]);

  const publishedPhotos = useMemo(
    () => photos.filter((p) => p.is_published),
    [photos]
  );

  const categories = useMemo(() => {
    const existing = new Set(publishedPhotos.map((p) => p.category).filter(Boolean));
    const merged = Array.from(new Set([...PHOTO_CATEGORIES, ...existing]));
    return ['All', ...merged];
  }, [publishedPhotos]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return publishedPhotos;
    return publishedPhotos.filter((p) => p.category === selectedCategory);
  }, [publishedPhotos, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8A7768] mb-3">
            Visual Keepsakes
          </p>
          <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#241B15]">
            Personal Photo Gallery
          </h1>
          <p className="mt-4 text-base text-[#5C4B40] leading-relaxed">
            Every photograph holds a place, a season, and a piece of who I am. Click any image to open the full-screen viewer.
          </p>
        </div>

        {/* Layout Toggle */}
        <div
          role="group"
          aria-label="Gallery layout view"
          className="inline-flex items-center p-1 rounded-lg bg-[#F1EAE0] border border-[#E3DACD] self-start"
        >
          <button
            type="button"
            onClick={() => setLayoutMode('masonry')}
            aria-pressed={layoutMode === 'masonry'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              layoutMode === 'masonry'
                ? 'bg-[#FFFDF9] text-[#241B15] shadow-sm'
                : 'text-[#6E5C4E] hover:text-[#241B15]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Masonry</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('grid')}
            aria-pressed={layoutMode === 'grid'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              layoutMode === 'grid'
                ? 'bg-[#FFFDF9] text-[#241B15] shadow-sm'
                : 'text-[#6E5C4E] hover:text-[#241B15]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Grid</span>
          </button>
        </div>
      </header>

      {/* Category Filter Bar */}
      <div
        role="tablist"
        aria-label="Filter gallery by category"
        className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[#E3DACD]"
      >
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-[#241B15] text-[#FAF7F2]'
                  : 'bg-[#FFFDF9] border border-[#E3DACD] text-[#5C4B40] hover:bg-[#F1EAE0]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] text-center">
          <Camera className="w-8 h-8 mx-auto text-[#8A7768] mb-3" aria-hidden="true" />
          <h2 className="font-editorial text-2xl font-semibold text-[#241B15]">
            No published photographs in {selectedCategory}
          </h2>
          <p className="mt-2 text-sm text-[#6E5C4E]">
            Photographs uploaded by Mark become visible here once explicitly published.
          </p>
        </div>
      ) : (
        <div
          className={
            layoutMode === 'masonry'
              ? 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          }
        >
          {filtered.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className={`group w-full text-left rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] overflow-hidden hover:border-[#B69F87] transition-colors focus-visible:outline-2 focus-visible:outline-[#7C4A2D] ${
                layoutMode === 'masonry' ? 'break-inside-avoid block' : 'flex flex-col'
              }`}
            >
              <div
                className={`overflow-hidden bg-[#EFE8DC] ${
                  layoutMode === 'grid' ? 'aspect-[4/3]' : ''
                }`}
              >
                <ResilientImage
                  src={photo.url}
                  alt={photo.caption || photo.title || 'Gallery photograph'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8A7768]">
                  {photo.category}
                </p>
                {photo.title && (
                  <h2 className="mt-1 font-editorial text-xl font-semibold text-[#241B15]">
                    {photo.title}
                  </h2>
                )}
                {photo.caption && (
                  <p className="mt-1 text-sm text-[#4A3B31] leading-relaxed">
                    {photo.caption}
                  </p>
                )}
                {(photo.date_taken || photo.location) && (
                  <div className="mt-3 pt-2.5 border-t border-[#EFE8DC] flex flex-wrap items-center gap-3 text-xs text-[#8A7768]">
                    {photo.date_taken && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        {photo.date_taken}
                      </span>
                    )}
                    {photo.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" aria-hidden="true" />
                        {photo.location}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <LightboxModal
        items={filtered}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </div>
  );
}
