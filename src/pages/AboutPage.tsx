import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { useContent } from '../context/ContentContext';

export function AboutPage() {
  const { bundle } = useContent();
  const { profile, settings } = bundle;

  useEffect(() => {
    document.title = `About Me – ${settings.site_title}`;
  }, [settings.site_title]);

  const profileFields = [
    { label: 'Name', value: profile.full_name },
    { label: 'Age', value: profile.age },
    { label: 'Educational Background', value: profile.education },
    { label: 'Hobbies & Interests', value: profile.hobbies },
    { label: 'Personality', value: profile.personality },
    { label: 'Values & Beliefs', value: profile.values_beliefs },
    { label: 'Philosophy in Life', value: profile.life_philosophy },
    { label: 'Personal Goals', value: profile.personal_goals },
    { label: 'Future Aspirations', value: profile.future_aspirations },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8A7768] mb-3">
          Personal Profile
        </p>
        <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#241B15]">
          About Me
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#5C4B40] max-w-2xl leading-relaxed">
          {profile.intro_text}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-14">
        <div className="lg:col-span-5">
          <figure className="bg-[#FFFDF9] p-3 rounded-2xl border border-[#E3DACD]">
            <div className="aspect-[3/4] overflow-hidden rounded-xl">
              <ResilientImage
                src={profile.avatar_url}
                alt={`Portrait of ${profile.full_name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="pt-3 px-1 pb-1 text-xs font-editorial italic text-[#6E5C4E]">
              {profile.full_name} · {profile.education}
            </figcaption>
          </figure>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <blockquote className="py-5 border-y border-[#E3DACD] font-editorial italic text-2xl sm:text-3xl text-[#241B15] leading-snug">
            “{profile.personal_quote}”
          </blockquote>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#8A7768] font-semibold mb-3">
              Short Biography
            </h2>
            <p className="text-base text-[#3D2E25] leading-relaxed whitespace-pre-line">
              {profile.short_bio}
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/understanding-self"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium hover:bg-[#3A2C23] transition-colors"
            >
              <span>Explore My Eight Dimensions</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/letter"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#CDBEAC] bg-[#FFFDF9] text-[#241B15] text-sm font-medium hover:bg-[#F1EAE0] transition-colors"
            >
              <span>Letter to Younger Me</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Archival Definition List of Profile Details */}
      <section className="rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] p-6 sm:p-10">
        <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#241B15] mb-6">
          Identity & Aspirations Archive
        </h2>
        <dl className="divide-y divide-[#EAE1D4]">
          {profileFields.map((item) => (
            <div
              key={item.label}
              className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline"
            >
              <dt className="sm:col-span-4 text-xs uppercase tracking-[0.18em] text-[#8A7768] font-semibold">
                {item.label}
              </dt>
              <dd className="sm:col-span-8 text-sm sm:text-base text-[#241B15] leading-relaxed">
                {item.value || 'Not added yet.'}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
