import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { LightboxModal, type LightboxImageItem } from '../components/LightboxModal';
import { ResilientImage } from '../components/ResilientImage';
import { useContent } from '../context/ContentContext';
import { estimateReadingTime, formatEditorialDate } from '../utils/editorial';

export function HomePage() {
  const { bundle } = useContent();
  const { settings, dimensions, timeline, posts, photos, thenAndNow, letter } = bundle;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = `${settings.site_title} – A Personal Digital Autobiography`;
  }, [settings.site_title]);

  const publishedPosts = posts.filter((p) => p.is_published).slice(0, 3);
  const publishedPhotos = photos.filter((p) => p.is_published);
  const collagePhotos: LightboxImageItem[] =
    publishedPhotos.length > 0
      ? publishedPhotos.slice(0, 5)
      : [
          {
            url: thenAndNow.younger_photo_url,
            title: 'Childhood Afternoon',
            caption: thenAndNow.younger_caption,
            date_taken: thenAndNow.younger_date_age,
            category: 'Childhood',
          },
          {
            url: settings.hero_photo_url,
            title: 'Present Reflections',
            caption: settings.hero_photo_caption,
            date_taken: 'Present',
            category: 'Everyday Keepsakes',
          },
        ];

  return (
    <div>
      {/* 1. Editorial Split Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8A7768] mb-4">
              {settings.course_label}
            </p>
            <h1 className="text-balance">
              <BrandMark size="hero" />
            </h1>
            <p className="mt-6 font-editorial italic text-2xl sm:text-[1.7rem] text-[#5C4B40] leading-snug max-w-2xl">
              “{settings.tagline}”
            </p>
            <p className="mt-5 text-base sm:text-[1.05rem] text-[#4A3B31] leading-relaxed max-w-xl">
              {settings.hero_intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/journey"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium tracking-[0.05em] hover:bg-[#3A2C23] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#7C4A2D]"
              >
                <span>EXPLORE MY STORY</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[#CDBEAC] bg-[#FFFDF9] text-[#241B15] text-sm font-medium tracking-[0.05em] hover:bg-[#F1EAE0] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#7C4A2D]"
              >
                <span>GET TO KNOW ME</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <figure className="h-full flex flex-col bg-[#FFFDF9] p-3 rounded-2xl border border-[#E3DACD] shadow-sm">
              <div className="flex-1 overflow-hidden rounded-xl min-h-[340px] lg:min-h-[460px]">
                <ResilientImage
                  src={settings.hero_photo_url}
                  alt="Featured portrait of Mark"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="pt-3 px-1 pb-1 text-xs font-editorial italic text-[#6E5C4E]">
                Fig. 01 — {settings.hero_photo_caption}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 2. Introductory Statement */}
      <section className="border-y border-[#E3DACD] bg-[#F4EFE6] py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8A7768] mb-4">
            Prologue
          </p>
          <blockquote className="font-editorial italic text-2xl sm:text-4xl text-[#241B15] leading-snug text-balance">
            “{settings.intro_statement}”
          </blockquote>
        </div>
      </section>

      {/* 3. A Little Glimpse of My Life (Editorial Collage) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#8A7768] mb-2">
              Visual Archive
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#241B15]">
              A Little Glimpse of My Life
            </h2>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7C4A2D] hover:text-[#5E3620] underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {collagePhotos.map((item, idx) => {
            const spanClass =
              idx === 0
                ? 'md:col-span-7 md:row-span-2 min-h-[320px] md:min-h-[460px]'
                : idx === 1 || idx === 2
                  ? 'md:col-span-5 min-h-[220px]'
                  : 'md:col-span-6 min-h-[240px]';

            return (
              <button
                key={item.id || `${item.url}-${idx}`}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                aria-label={`Open photograph: ${item.title || item.caption || 'Life glimpse'}`}
                className={`group relative overflow-hidden rounded-2xl border border-[#E3DACD] bg-[#FFFDF9] text-left focus-visible:outline-2 focus-visible:outline-[#7C4A2D] ${spanClass}`}
              >
                <ResilientImage
                  src={item.url}
                  alt={item.caption || item.title || 'Glimpse of Mark'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1C140F]/85 via-[#1C140F]/45 to-transparent p-5 text-[#FAF7F2]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#E6D9C7]">
                    {[item.category, item.date_taken].filter(Boolean).join(' · ') || 'Memory'}
                  </p>
                  <p className="mt-1 font-editorial text-xl font-medium leading-snug">
                    {item.title || item.caption}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Introductory Mini-Timeline */}
      <section className="border-y border-[#E3DACD] bg-[#FFFDF9] py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#8A7768] mb-2">
                Chronology
              </p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#241B15]">
                Stages That Shaped Me
              </h2>
            </div>
            <Link
              to="/journey"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7C4A2D] hover:text-[#5E3620] underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              <span>Open Full Life Journey</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeline.slice(0, 6).map((stage, index) => (
              <Link
                key={stage.id}
                to={`/journey#stage-${stage.sort_order}`}
                className="group p-6 rounded-2xl bg-[#FAF7F2] border border-[#E3DACD] hover:border-[#B69F87] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8A7768] mb-3">
                    <span className="uppercase tracking-[0.18em]">
                      Chapter {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{stage.age_or_year}</span>
                  </div>
                  <h3 className="font-editorial text-2xl font-semibold text-[#241B15] group-hover:text-[#7C4A2D] transition-colors">
                    {stage.stage_title}
                  </h3>
                  <p className="mt-2.5 text-sm text-[#5C4B40] leading-relaxed line-clamp-3">
                    {stage.story}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-[#7C4A2D]">
                  <span>Read chapter</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Understanding My Self — 8 Dimensions Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#8A7768] mb-2">
              Understanding the Self
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#241B15]">
              Eight Dimensions of Who I Am
            </h2>
          </div>
          <Link
            to="/understanding-self"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7C4A2D] hover:text-[#5E3620] underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            <span>Explore All Eight</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {dimensions.map((dim) => (
            <Link
              key={dim.slug}
              to={`/understanding-self/${dim.slug}`}
              className="group rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] overflow-hidden hover:border-[#B69F87] transition-colors flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#EFE8DC]">
                <ResilientImage
                  src={dim.featured_photo_url}
                  alt={dim.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8A7768]">
                  Dimension {dim.letter_code}
                </p>
                <h3 className="mt-1 font-editorial text-2xl font-semibold text-[#241B15] group-hover:text-[#7C4A2D] transition-colors">
                  {dim.title}
                </h3>
                <p className="mt-2 text-sm text-[#5C4B40] leading-relaxed line-clamp-2 flex-1">
                  {dim.intro_description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Special Keepsakes: Then & Now + Letter to Younger Me */}
      <section className="border-y border-[#E3DACD] bg-[#F4EFE6] py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Link
            to="/then-and-now"
            className="group p-8 rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] hover:border-[#B69F87] transition-colors flex flex-col justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8A7768] mb-2">
                Special Feature
              </p>
              <h3 className="font-editorial text-3xl font-semibold text-[#241B15] group-hover:text-[#7C4A2D] transition-colors">
                Then and Now: A Journey Through Time
              </h3>
              <p className="mt-3 text-sm text-[#5C4B40] leading-relaxed">
                Side-by-side portraits comparing my younger self with who I am today — reflecting on how much has changed and what endured.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#7C4A2D]">
              <span>View Comparison</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </Link>

          <Link
            to="/letter"
            className="group p-8 rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] hover:border-[#B69F87] transition-colors flex flex-col justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8A7768] mb-2">
                Handwritten Journal
              </p>
              <h3 className="font-editorial text-3xl font-semibold text-[#241B15] group-hover:text-[#7C4A2D] transition-colors">
                To the Younger Me
              </h3>
              <p className="mt-3 font-editorial italic text-lg text-[#5C4B40] leading-relaxed line-clamp-2">
                “{letter.title}” — {letter.letter_date}
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#7C4A2D]">
              <span>Read the Letter</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>

      {/* 7. Latest Published Reflections (Blog) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#8A7768] mb-2">
              Personal Journal
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#241B15]">
              Latest Published Reflections
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7C4A2D] hover:text-[#5E3620] underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {publishedPosts.length === 0 ? (
          <div className="p-10 rounded-2xl border border-[#E3DACD] bg-[#FFFDF9] text-center">
            <BookOpen className="w-7 h-7 mx-auto text-[#8A7768] mb-3" aria-hidden="true" />
            <p className="font-editorial text-2xl text-[#241B15]">No published reflections yet</p>
            <p className="mt-2 text-sm text-[#6E5C4E]">
              Published essays and life lessons will appear here once Mark publishes them from the Administrator Dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {publishedPosts.map((post) => (
              <article
                key={post.id}
                className="group rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] overflow-hidden flex flex-col hover:border-[#B69F87] transition-colors"
              >
                <Link to={`/blog/${post.slug}`} className="aspect-[4/3] overflow-hidden bg-[#EFE8DC] block">
                  <ResilientImage
                    src={post.featured_photo_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A7768]">
                    <span className="font-medium text-[#7C4A2D]">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      {formatEditorialDate(post.published_at || post.created_at)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {estimateReadingTime(post.content)} min read
                    </span>
                  </div>
                  <h3 className="mt-3 font-editorial text-2xl font-semibold text-[#241B15] leading-snug group-hover:text-[#7C4A2D] transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-2.5 text-sm text-[#5C4B40] leading-relaxed line-clamp-3 flex-1">
                    {post.short_description}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#7C4A2D]"
                  >
                    <span>Read reflection</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <LightboxModal
        items={collagePhotos}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </div>
  );
}
