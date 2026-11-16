import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { useContent } from '../context/ContentContext';

export function UnderstandingSelfPage() {
  const { bundle } = useContent();
  const { dimensions, settings } = bundle;

  useEffect(() => {
    document.title = `Understanding My Self – ${settings.site_title}`;
  }, [settings.site_title]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <header className="max-w-3xl mb-14">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8A7768] mb-3">
          Eight Dimensions of Identity
        </p>
        <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#241B15]">
          UNDERSTANDING MY SELF
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#5C4B40] leading-relaxed">
          Understanding who I am requires looking thoughtfully at every dimension of my lived experience — material, physical, sexual, spiritual, political, digital, social, and emotional. Open any chapter below to read reflections and explore photographs.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {dimensions.map((dim) => (
          <Link
            key={dim.slug}
            to={`/understanding-self/${dim.slug}`}
            className="group rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] overflow-hidden hover:border-[#B69F87] transition-colors flex flex-col sm:flex-row items-stretch"
          >
            <div className="sm:w-48 lg:w-56 aspect-[4/3] sm:aspect-auto shrink-0 overflow-hidden bg-[#EFE8DC]">
              <ResilientImage
                src={dim.featured_photo_url}
                alt={dim.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#8A7768]">
                  {dim.letter_code}. {dim.subtitle}
                </p>
                <h2 className="mt-1.5 font-editorial text-2xl sm:text-3xl font-semibold text-[#241B15] group-hover:text-[#7C4A2D] transition-colors">
                  {dim.title}
                </h2>
                <p className="mt-2.5 text-sm text-[#5C4B40] leading-relaxed">
                  {dim.intro_description}
                </p>
              </div>

              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#7C4A2D]">
                <span>Open {dim.title}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
