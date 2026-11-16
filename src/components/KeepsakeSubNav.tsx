import { Link, useLocation } from 'react-router-dom';

const CHAPTER_LINKS = [
  { to: '/journey', label: 'Life Timeline' },
  { to: '/then-and-now', label: 'Then & Now' },
  { to: '/letter', label: 'To the Younger Me' },
];

export function KeepsakeSubNav() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Story chapters navigation"
      className="flex flex-wrap items-center gap-2 border-b border-[#E3DACD] pb-4 mb-10"
    >
      {CHAPTER_LINKS.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              active
                ? 'bg-[#241B15] text-[#FAF7F2]'
                : 'text-[#5C4B40] hover:bg-[#F1EAE0] hover:text-[#241B15]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
