import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { LightboxModal } from '../components/LightboxModal';
import { ResilientImage } from '../components/ResilientImage';
import { useContent } from '../context/ContentContext';

export function SelfDimensionPage() {
  const { slug } = useParams<{ slug: string }>();
  const { bundle } = useContent();
  const { dimensions, photos, settings } = bundle;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const currentIndex = dimensions.findIndex((d) => d.slug === slug);
  const dimension = currentIndex >= 0 ? dimensions[currentIndex] : undefined;

  useEffect(() => {
    if (dimension) {
      document.title = `${dimension.title} – ${settings.site_title}`;
    }
  }, [dimension, settings.site_title]);

  if (!dimension) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-editorial text-4xl font-semibold text-[#241B15]">
          Dimension Not Found
        </h1>
        <p className="mt-3 text-sm text-[#5C4B40]">
          The requested dimension of the self could not be found.
        </p>
        <Link
          to="/understanding-self"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Understanding My Self</span>
        </Link>
      </div>
    );
  }

  const dimensionPhotos = photos.filter(
    (p) => p.is_published && p.dimension_slug === dimension.slug
  );
  const prevDim = currentIndex > 0 ? dimensions[currentIndex - 1] : null;
  const nextDim =
    currentIndex < dimensions.length - 1 ? dimensions[currentIndex + 1] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Consistent Sub-navigation Across All 8 Dimensions */}
      <nav
        aria-label="Eight Dimensions switcher"
        className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[#E3DACD]"
      >
        <Link
          to="/understanding-self"
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#5C4B40] hover:bg-[#F1EAE0] whitespace-nowrap shrink-0"
        >
          All 8
        </Link>
        {dimensions.map((d) => {
          const active = d.slug === dimension.slug;
          return (
            <Link
              key={d.slug}
              to={`/understanding-self/${d.slug}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-[#241B15] text-[#FAF7F2]'
                  : 'text-[#5C4B40] hover:bg-[#F1EAE0] hover:text-[#241B15]'
              }`}
            >
              {d.letter_code}. {d.title}
            </Link>
          );
        })}
      </nav>

      {/* Unique & Attractive Header */}
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8A7768] mb-2">
          Dimension {dimension.letter_code} · {dimension.subtitle}
        </p>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#241B15]">
          {dimension.title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#5C4B40] leading-relaxed max-w-3xl">
          {dimension.intro_description}
        </p>
      </header>

      {/* Featured Photograph */}
      <figure className="mb-12 bg-[#FFFDF9] p-3 rounded-2xl border border-[#E3DACD]">
        <div className="aspect-[16/9] overflow-hidden rounded-xl bg-[#EFE8DC]">
          <ResilientImage
            src={dimension.featured_photo_url}
            alt={`Featured image for ${dimension.title}`}
            className="w-full h-full object-cover"
          />
        </div>
        <figcaption className="pt-3 px-1 pb-1 text-xs font-editorial italic text-[#6E5C4E]">
          Featured study for {dimension.title} — {dimension.subtitle}
        </figcaption>
      </figure>

      {/* Two-Column Asymmetric Reading Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        <article className="lg:col-span-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#8A7768] font-semibold mb-4">
            Personal Reflection
          </h2>
          <div className="space-y-5 text-base sm:text-[1.06rem] text-[#352820] leading-[1.85]">
            {dimension.reflection_content
              .split(/\n\n+/)
              .filter(Boolean)
              .map((paragraph, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-5xl first-letter:font-editorial first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:text-[#7C4A2D]'
                      : ''
                  }
                >
                  {paragraph}
                </p>
              ))}
          </div>
        </article>

        <aside className="lg:col-span-4">
          <div className="p-6 rounded-2xl bg-[#F4EFE6] border border-[#E3DACD]">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[#8A7768] font-semibold mb-4">
              Guided Themes
            </h3>
            <ul className="space-y-3 text-sm text-[#4A3B31]">
              {(dimension.prompts || []).map((prompt, idx) => (
                <li
                  key={idx}
                  className="pb-3 border-b border-[#E3DACD] last:border-b-0 last:pb-0"
                >
                  <span className="text-xs text-[#8A7768] mr-2">
                    0{idx + 1}.
                  </span>
                  {prompt}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Dimension Photo Gallery */}
      <section className="pt-10 border-t border-[#E3DACD]">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8A7768] mb-1">
              Visual Evidence
            </p>
            <h2 className="font-editorial text-3xl font-semibold text-[#241B15]">
              {dimension.title} Photo Archive
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-medium text-[#7C4A2D] hover:underline"
          >
            View Complete Gallery
          </Link>
        </div>

        {dimensionPhotos.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] text-center">
            <p className="font-editorial text-2xl text-[#241B15]">
              No published photographs linked to {dimension.title} yet
            </p>
            <p className="mt-2 text-sm text-[#6E5C4E]">
              Mark can upload and assign photographs to this dimension anytime via the private Administrator Dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dimensionPhotos.map((photo, idx) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className="group text-left rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] overflow-hidden hover:border-[#B69F87] transition-colors flex flex-col focus-visible:outline-2 focus-visible:outline-[#7C4A2D]"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#EFE8DC]">
                  <ResilientImage
                    src={photo.url}
                    alt={photo.caption || photo.title || dimension.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  {photo.title && (
                    <h3 className="font-editorial text-xl font-semibold text-[#241B15]">
                      {photo.title}
                    </h3>
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
      </section>

      {/* Previous / Next Dimension Navigation */}
      <div className="mt-14 pt-8 border-t border-[#E3DACD] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {prevDim ? (
          <Link
            to={`/understanding-self/${prevDim.slug}`}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-[#E3DACD] bg-[#FFFDF9] hover:bg-[#F1EAE0] text-sm font-medium text-[#241B15]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>
              {prevDim.letter_code}. {prevDim.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {nextDim && (
          <Link
            to={`/understanding-self/${nextDim.slug}`}
            className="inline-flex items-center justify-end gap-2 px-4 py-3 rounded-lg border border-[#E3DACD] bg-[#FFFDF9] hover:bg-[#F1EAE0] text-sm font-medium text-[#241B15]"
          >
            <span>
              {nextDim.letter_code}. {nextDim.title}
            </span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      <LightboxModal
        items={dimensionPhotos}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </div>
  );
}
