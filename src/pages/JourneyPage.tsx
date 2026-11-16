import { useEffect, useState } from 'react';
import { KeepsakeSubNav } from '../components/KeepsakeSubNav';
import { LightboxModal, type LightboxImageItem } from '../components/LightboxModal';
import { ResilientImage } from '../components/ResilientImage';
import { useContent } from '../context/ContentContext';

export function JourneyPage() {
  const { bundle } = useContent();
  const { timeline, photos, settings } = bundle;
  const [lightboxItems, setLightboxItems] = useState<LightboxImageItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = `My Life Journey – ${settings.site_title}`;
  }, [settings.site_title]);

  const openGalleryLightbox = (items: LightboxImageItem[], idx: number) => {
    setLightboxItems(items);
    setLightboxIndex(idx);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <KeepsakeSubNav />

      <header className="max-w-3xl mb-12">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8A7768] mb-3">
          Chronological Autobiography
        </p>
        <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#241B15]">
          My Life Journey: Childhood to Present
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#5C4B40] leading-relaxed">
          Every stage left a distinct mark — from my earliest years of curiosity through high school friendships, college growth, and who I am becoming today.
        </p>
      </header>

      {/* Quick Chapter Jump Bar */}
      {timeline.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12">
          {timeline.map((stage, idx) => (
            <a
              key={stage.id}
              href={`#stage-${stage.sort_order}`}
              className="px-3.5 py-1.5 rounded-lg border border-[#E3DACD] bg-[#FFFDF9] text-xs font-medium text-[#4A3B31] hover:bg-[#F1EAE0] transition-colors"
            >
              {String(idx + 1).padStart(2, '0')}. {stage.stage_title}
            </a>
          ))}
        </div>
      )}

      {/* Vertical Editorial Timeline */}
      <div className="relative space-y-12 before:hidden md:before:block before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-[#D8CCBC]">
        {timeline.map((stage, idx) => {
          const linkedPhotos = photos.filter(
            (p) => p.is_published && p.timeline_stage_id === stage.id
          );
          const stageGallery: LightboxImageItem[] = [
            ...(stage.cover_photo_url
              ? [
                  {
                    url: stage.cover_photo_url,
                    title: stage.stage_title,
                    caption: stage.memories || stage.story,
                    date_taken: stage.age_or_year,
                  },
                ]
              : []),
            ...linkedPhotos,
          ];

          return (
            <article
              key={stage.id}
              id={`stage-${stage.sort_order}`}
              className="md:pl-14 relative scroll-mt-24"
            >
              {/* Timeline Index Marker */}
              <div
                aria-hidden="true"
                className="hidden md:flex absolute left-0 top-6 w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#B69F87] items-center justify-center font-editorial text-sm font-semibold text-[#7C4A2D]"
              >
                {String(idx + 1).padStart(2, '0')}
              </div>

              <div className="rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {stage.cover_photo_url && (
                    <button
                      type="button"
                      onClick={() => openGalleryLightbox(stageGallery, 0)}
                      aria-label={`Inspect photograph for ${stage.stage_title}`}
                      className="lg:col-span-5 aspect-[4/3] lg:aspect-auto overflow-hidden bg-[#EFE8DC] group focus-visible:outline-2 focus-visible:outline-[#7C4A2D]"
                    >
                      <ResilientImage
                        src={stage.cover_photo_url}
                        alt={stage.stage_title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </button>
                  )}

                  <div
                    className={`${
                      stage.cover_photo_url ? 'lg:col-span-7' : 'lg:col-span-12'
                    } p-6 sm:p-8 space-y-5`}
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8A7768]">
                        Chapter {String(idx + 1).padStart(2, '0')} · {stage.age_or_year}
                      </p>
                      <h2 className="mt-1 font-editorial text-3xl font-semibold text-[#241B15]">
                        {stage.stage_title}
                      </h2>
                    </div>

                    <p className="text-sm sm:text-base text-[#3D2E25] leading-relaxed">
                      {stage.story}
                    </p>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EFE8DC] text-sm">
                      {stage.memories && (
                        <div>
                          <dt className="text-xs uppercase tracking-[0.16em] text-[#8A7768] font-semibold mb-1">
                            Important Memories
                          </dt>
                          <dd className="text-[#4A3B31] leading-relaxed">{stage.memories}</dd>
                        </div>
                      )}
                      {stage.milestones && (
                        <div>
                          <dt className="text-xs uppercase tracking-[0.16em] text-[#8A7768] font-semibold mb-1">
                            Achievements & Milestones
                          </dt>
                          <dd className="text-[#4A3B31] leading-relaxed">{stage.milestones}</dd>
                        </div>
                      )}
                      {stage.lessons_learned && (
                        <div>
                          <dt className="text-xs uppercase tracking-[0.16em] text-[#8A7768] font-semibold mb-1">
                            Lessons Learned
                          </dt>
                          <dd className="text-[#4A3B31] leading-relaxed">{stage.lessons_learned}</dd>
                        </div>
                      )}
                      {stage.reflection && (
                        <div>
                          <dt className="text-xs uppercase tracking-[0.16em] text-[#8A7768] font-semibold mb-1">
                            Personal Reflection
                          </dt>
                          <dd className="font-editorial italic text-base text-[#4A3B31] leading-relaxed">
                            “{stage.reflection}”
                          </dd>
                        </div>
                      )}
                    </dl>

                    {linkedPhotos.length > 0 && (
                      <div className="pt-4 border-t border-[#EFE8DC]">
                        <p className="text-xs uppercase tracking-[0.16em] text-[#8A7768] mb-2.5">
                          Stage Photographs ({linkedPhotos.length})
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {linkedPhotos.map((lp, lpIdx) => (
                            <button
                              key={lp.id}
                              type="button"
                              onClick={() =>
                                openGalleryLightbox(
                                  stageGallery,
                                  (stage.cover_photo_url ? 1 : 0) + lpIdx
                                )
                              }
                              aria-label={`View ${lp.title || lp.caption || 'stage photo'}`}
                              className="w-20 h-16 rounded-lg overflow-hidden border border-[#E3DACD] hover:border-[#7C4A2D] transition-colors"
                            >
                              <ResilientImage
                                src={lp.url}
                                alt={lp.caption || lp.title || stage.stage_title}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <LightboxModal
        items={lightboxItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </div>
  );
}
