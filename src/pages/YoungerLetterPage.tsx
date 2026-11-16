import { useEffect, useState } from 'react';
import { KeepsakeSubNav } from '../components/KeepsakeSubNav';
import { LightboxModal } from '../components/LightboxModal';
import { ResilientImage } from '../components/ResilientImage';
import { useContent } from '../context/ContentContext';

export function YoungerLetterPage() {
  const { bundle } = useContent();
  const { letter, settings } = bundle;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    document.title = `To the Younger Me – ${settings.site_title}`;
  }, [settings.site_title]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <KeepsakeSubNav />

      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8A7768] mb-3">
          Vintage Personal Journal
        </p>
        <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#241B15]">
          TO THE YOUNGER ME
        </h1>
      </header>

      {/* Vintage Stationery Paper Card */}
      <article className="stationery-paper rounded-2xl border border-[#DFD2BE] shadow-sm p-7 sm:p-12 lg:p-16">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-[#E5DAC8]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8A7768]">
              {letter.letter_date}
            </p>
            <h2 className="mt-2 font-editorial italic text-2xl sm:text-3xl font-semibold text-[#241B15]">
              {letter.title}
            </h2>
          </div>

          {letter.childhood_photo_url && (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Enlarge childhood photograph"
              className="w-32 sm:w-36 shrink-0 rounded-xl bg-white p-2 border border-[#DFD2BE] shadow-sm hover:border-[#7C4A2D] transition-colors self-start"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <ResilientImage
                  src={letter.childhood_photo_url}
                  alt="Childhood keepsake photograph"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="block mt-1.5 text-[11px] font-editorial italic text-[#6E5C4E] text-center">
                Younger Mark
              </span>
            </button>
          )}
        </div>

        <div className="mt-8 space-y-6 font-editorial text-xl sm:text-[1.35rem] leading-[36px] text-[#2F241C]">
          {letter.letter_body
            .split(/\n\n+/)
            .filter(Boolean)
            .map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#E5DAC8] font-editorial italic text-xl text-[#4A3B31] whitespace-pre-line">
          {letter.signature}
        </div>
      </article>

      <LightboxModal
        items={
          letter.childhood_photo_url
            ? [
                {
                  url: letter.childhood_photo_url,
                  title: letter.title,
                  caption: `Keepsake photograph accompanying letter (${letter.letter_date})`,
                },
              ]
            : []
        }
        activeIndex={lightboxOpen ? 0 : null}
        onClose={() => setLightboxOpen(false)}
        onChangeIndex={() => {}}
      />
    </div>
  );
}
