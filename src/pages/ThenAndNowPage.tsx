import { useEffect, useState } from 'react';
import { KeepsakeSubNav } from '../components/KeepsakeSubNav';
import { LightboxModal, type LightboxImageItem } from '../components/LightboxModal';
import { ResilientImage } from '../components/ResilientImage';
import { useContent } from '../context/ContentContext';

export function ThenAndNowPage() {
  const { bundle } = useContent();
  const { thenAndNow, settings } = bundle;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = `Then and Now – ${settings.site_title}`;
  }, [settings.site_title]);

  const compareItems: LightboxImageItem[] = [
    {
      url: thenAndNow.younger_photo_url,
      title: 'Then — Younger Self',
      caption: thenAndNow.younger_caption,
      date_taken: thenAndNow.younger_date_age,
      category: 'Then & Now',
    },
    {
      url: thenAndNow.present_photo_url,
      title: 'Now — Present Self',
      caption: thenAndNow.present_caption,
      date_taken: thenAndNow.present_date_age,
      category: 'Then & Now',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <KeepsakeSubNav />

      <header className="max-w-3xl mb-12">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8A7768] mb-3">
          Side-by-Side Reflection
        </p>
        <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#241B15]">
          THEN AND NOW: A JOURNEY THROUGH TIME
        </h1>
        <p className="mt-4 text-base text-[#5C4B40] leading-relaxed">
          Looking across the years between who I was in my earliest memories and who stands here today.
        </p>
      </header>

      {/* Side-by-Side Photographs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {/* LEFT: Younger Self */}
        <article className="rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] p-4 flex flex-col">
          <div className="flex items-center justify-between px-1 pb-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#7C4A2D] font-semibold">
              Then · Younger Self
            </span>
            <span className="text-xs text-[#8A7768]">{thenAndNow.younger_date_age}</span>
          </div>
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            aria-label="Inspect younger self photograph"
            className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#EFE8DC] group focus-visible:outline-2 focus-visible:outline-[#7C4A2D]"
          >
            <ResilientImage
              src={thenAndNow.younger_photo_url}
              alt={thenAndNow.younger_caption || 'Younger Mark'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
          <p className="mt-4 px-1 font-editorial italic text-lg text-[#3D2E25] leading-relaxed">
            “{thenAndNow.younger_caption}”
          </p>
        </article>

        {/* RIGHT: Present Self */}
        <article className="rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] p-4 flex flex-col">
          <div className="flex items-center justify-between px-1 pb-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#7C4A2D] font-semibold">
              Now · Present Self
            </span>
            <span className="text-xs text-[#8A7768]">{thenAndNow.present_date_age}</span>
          </div>
          <button
            type="button"
            onClick={() => setLightboxIndex(1)}
            aria-label="Inspect present self photograph"
            className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#EFE8DC] group focus-visible:outline-2 focus-visible:outline-[#7C4A2D]"
          >
            <ResilientImage
              src={thenAndNow.present_photo_url}
              alt={thenAndNow.present_caption || 'Present Mark'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
          <p className="mt-4 px-1 font-editorial italic text-lg text-[#3D2E25] leading-relaxed">
            “{thenAndNow.present_caption}”
          </p>
        </article>
      </div>

      {/* Reflection Section */}
      <section className="rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] p-7 sm:p-10 max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8A7768] mb-2">
          Personal Essay
        </p>
        <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#241B15] mb-6">
          {thenAndNow.reflection_title}
        </h2>
        <div className="space-y-5 text-base text-[#352820] leading-[1.85]">
          {thenAndNow.reflection_content
            .split(/\n\n+/)
            .filter(Boolean)
            .map((p, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? 'first-letter:text-5xl first-letter:font-editorial first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:text-[#7C4A2D]'
                    : ''
                }
              >
                {p}
              </p>
            ))}
        </div>
      </section>

      <LightboxModal
        items={compareItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </div>
  );
}
