import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { LightboxModal, type LightboxImageItem } from '../components/LightboxModal';
import { ResilientImage } from '../components/ResilientImage';
import { useContent } from '../context/ContentContext';
import { estimateReadingTime, formatEditorialDate } from '../utils/editorial';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { bundle } = useContent();
  const { posts, settings } = bundle;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const post = posts.find((p) => p.slug === slug && p.is_published);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} – ${settings.site_title}`;
    }
  }, [post, settings.site_title]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-editorial text-4xl font-semibold text-[#241B15]">
          Article Not Available
        </h1>
        <p className="mt-3 text-sm text-[#5C4B40]">
          This reflection either does not exist or has not been published yet.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to All Reflections</span>
        </Link>
      </div>
    );
  }

  const galleryItems: LightboxImageItem[] = [
    ...(post.featured_photo_url
      ? [{ url: post.featured_photo_url, title: post.title, caption: post.short_description }]
      : []),
    ...(post.additional_photos || []).map((ap) => ({
      url: ap.url,
      caption: ap.caption,
      title: post.title,
    })),
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#7C4A2D] hover:text-[#5E3620] mb-8"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Blog & Reflections</span>
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#8A7768] mb-3">
          <span className="font-medium text-[#7C4A2D] uppercase tracking-[0.16em]">
            {post.category}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {formatEditorialDate(post.published_at || post.created_at)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {estimateReadingTime(post.content)} min read
          </span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#241B15] leading-tight text-balance">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-[#5C4B40] leading-relaxed">
          {post.short_description}
        </p>
      </header>

      {post.featured_photo_url && (
        <figure className="mb-12 bg-[#FFFDF9] p-3 rounded-2xl border border-[#E3DACD]">
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="w-full aspect-[16/9] overflow-hidden rounded-xl bg-[#EFE8DC] block"
          >
            <ResilientImage
              src={post.featured_photo_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </button>
        </figure>
      )}

      <div className="max-w-prose mx-auto space-y-6 text-base sm:text-[1.08rem] text-[#352820] leading-[1.85]">
        {post.content
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

      {post.additional_photos && post.additional_photos.length > 0 && (
        <section className="mt-14 pt-10 border-t border-[#E3DACD]">
          <h2 className="font-editorial text-2xl font-semibold text-[#241B15] mb-6">
            Accompanying Photographs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {post.additional_photos.map((photo, idx) => (
              <figure
                key={`${photo.url}-${idx}`}
                className="rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] p-3"
              >
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((post.featured_photo_url ? 1 : 0) + idx)
                  }
                  className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-[#EFE8DC] block"
                >
                  <ResilientImage
                    src={photo.url}
                    alt={photo.caption || post.title}
                    className="w-full h-full object-cover"
                  />
                </button>
                {photo.caption && (
                  <figcaption className="pt-2.5 px-1 text-xs font-editorial italic text-[#6E5C4E]">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      <LightboxModal
        items={galleryItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </article>
  );
}
