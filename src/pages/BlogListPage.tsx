import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { useContent } from '../context/ContentContext';
import { BLOG_CATEGORIES } from '../types/autobiography';
import { estimateReadingTime, formatEditorialDate } from '../utils/editorial';

export function BlogListPage() {
  const { bundle } = useContent();
  const { posts, settings } = bundle;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    document.title = `Personal Blog & Reflections – ${settings.site_title}`;
  }, [settings.site_title]);

  // Public view strictly shows published posts only
  const publishedPosts = useMemo(
    () => posts.filter((p) => p.is_published),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return publishedPosts;
    return publishedPosts.filter((p) => p.category === selectedCategory);
  }, [publishedPosts, selectedCategory]);

  const leadPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <header className="max-w-3xl mb-10">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8A7768] mb-3">
          Personal Journal
        </p>
        <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#241B15]">
          Blog & Reflections
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#5C4B40] leading-relaxed">
          Essays on personal growth, formative memories, lessons learned, and quiet reflections from everyday life.
        </p>
      </header>

      {/* Interactive Category Filter Bar */}
      <div
        role="tablist"
        aria-label="Filter reflections by category"
        className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[#E3DACD]"
      >
        {['All', ...BLOG_CATEGORIES].map((cat) => {
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

      {filteredPosts.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] text-center">
          <BookOpen className="w-8 h-8 mx-auto text-[#8A7768] mb-3" aria-hidden="true" />
          <h2 className="font-editorial text-2xl font-semibold text-[#241B15]">
            No published articles in {selectedCategory}
          </h2>
          <p className="mt-2 text-sm text-[#6E5C4E]">
            Check another category or return soon after Mark publishes new reflections.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Lead Editorial Feature */}
          {leadPost && (
            <article className="group rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch hover:border-[#B69F87] transition-colors">
              <Link
                to={`/blog/${leadPost.slug}`}
                className="lg:col-span-7 aspect-[16/10] lg:aspect-auto min-h-[280px] overflow-hidden bg-[#EFE8DC] block"
              >
                <ResilientImage
                  src={leadPost.featured_photo_url}
                  alt={leadPost.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </Link>
              <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A7768]">
                  <span className="font-medium text-[#7C4A2D]">{leadPost.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatEditorialDate(leadPost.published_at || leadPost.created_at)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{estimateReadingTime(leadPost.content)} min read</span>
                </div>
                <h2 className="mt-3 font-editorial text-3xl sm:text-4xl font-semibold text-[#241B15] leading-snug group-hover:text-[#7C4A2D] transition-colors">
                  <Link to={`/blog/${leadPost.slug}`}>{leadPost.title}</Link>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#5C4B40] leading-relaxed">
                  {leadPost.short_description}
                </p>
                <Link
                  to={`/blog/${leadPost.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#7C4A2D]"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          )}

          {/* Secondary Articles Grid */}
          {restPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {restPosts.map((post) => (
                <article
                  key={post.id}
                  className="group rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] overflow-hidden flex flex-col hover:border-[#B69F87] transition-colors"
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="aspect-[4/3] overflow-hidden bg-[#EFE8DC] block"
                  >
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
                        {estimateReadingTime(post.content)} min
                      </span>
                    </div>
                    <h3 className="mt-3 font-editorial text-2xl font-semibold text-[#241B15] leading-snug group-hover:text-[#7C4A2D] transition-colors">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="mt-2 text-sm text-[#5C4B40] leading-relaxed flex-1">
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
        </div>
      )}
    </div>
  );
}
