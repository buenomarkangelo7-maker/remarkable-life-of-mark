import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUp, Lock, Menu, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { BrandMark } from './BrandMark';

const PRIMARY_NAV = [
  { to: '/about', label: 'About' },
  { to: '/understanding-self', label: 'My Self' },
  { to: '/journey', label: 'Journey' },
  { to: '/blog', label: 'Blog' },
  { to: '/gallery', label: 'Gallery' },
];

const MOBILE_ALL_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Me' },
  { to: '/understanding-self', label: 'Understanding My Self' },
  { to: '/journey', label: 'Life Journey Timeline' },
  { to: '/then-and-now', label: 'Then & Now' },
  { to: '/letter', label: 'To the Younger Me' },
  { to: '/blog', label: 'Blog & Reflections' },
  { to: '/gallery', label: 'Photo Gallery' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();
  const { bundle } = useContent();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#241B15]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/92 backdrop-blur-md border-b border-[#E3DACD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            to="/"
            className="whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#7C4A2D] rounded-sm py-1"
            aria-label="the reMARKable life of Mark home"
          >
            <BrandMark size="sm" />
          </Link>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C4B40]"
          >
            {PRIMARY_NAV.map((item) => {
              const active =
                pathname === item.to ||
                (item.to !== '/' && pathname.startsWith(`${item.to}/`)) ||
                (item.to === '/journey' &&
                  (pathname === '/then-and-now' || pathname === '/letter'));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors ${
                    active
                      ? 'text-[#241B15] border-[#7C4A2D]'
                      : 'border-transparent hover:text-[#241B15] hover:border-[#C9B9A6]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Drawer Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#D4C6B5] text-[#241B15] hover:bg-[#F1EAE0] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#7C4A2D]"
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#55634E]" aria-hidden="true" />
                  <span>Dashboard</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#7C4A2D]" aria-hidden="true" />
                  <span>Admin</span>
                </>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden p-2 rounded-lg border border-[#D4C6B5] text-[#241B15] hover:bg-[#F1EAE0] transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#E3DACD] bg-[#FFFDF9] px-4 py-4">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {MOBILE_ALL_LINKS.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                      active
                        ? 'bg-[#241B15] text-[#FAF7F2]'
                        : 'text-[#4A3B31] hover:bg-[#F1EAE0]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/admin"
                className="mt-2 px-3 py-2.5 rounded-lg text-sm font-medium border border-[#D4C6B5] text-[#241B15] flex items-center gap-2 hover:bg-[#F1EAE0]"
              >
                <Lock className="w-4 h-4 text-[#7C4A2D]" aria-hidden="true" />
                <span>{isAdmin ? 'Administrator Dashboard' : 'Private Admin Sign In'}</span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#E3DACD] bg-[#F4EFE6] text-[#4A3B31]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#E3DACD]">
            <div className="md:col-span-5">
              <BrandMark size="md" />
              <p className="mt-3 text-sm text-[#6E5C4E] leading-relaxed max-w-md">
                {bundle.settings.tagline}
              </p>
              <p className="mt-4 font-editorial italic text-base text-[#4A3B31]">
                “{bundle.settings.footer_quote}”
              </p>
            </div>

            <div className="md:col-span-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#8A7768] font-semibold mb-3">
                Chapters
              </h3>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <li><Link to="/about" className="hover:text-[#241B15] transition-colors">About Me</Link></li>
                <li><Link to="/understanding-self" className="hover:text-[#241B15] transition-colors">Understanding Self</Link></li>
                <li><Link to="/journey" className="hover:text-[#241B15] transition-colors">Life Journey</Link></li>
                <li><Link to="/then-and-now" className="hover:text-[#241B15] transition-colors">Then & Now</Link></li>
                <li><Link to="/letter" className="hover:text-[#241B15] transition-colors">To Younger Me</Link></li>
                <li><Link to="/blog" className="hover:text-[#241B15] transition-colors">Reflections Blog</Link></li>
                <li><Link to="/gallery" className="hover:text-[#241B15] transition-colors">Photo Gallery</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#8A7768] font-semibold mb-3">
                Archive & Access
              </h3>
              <p className="text-sm text-[#6E5C4E] leading-relaxed">
                {bundle.settings.footer_note}
              </p>
              <Link
                to="/admin"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#7C4A2D] hover:text-[#5E3620] underline underline-offset-4"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isAdmin ? 'Open Admin Dashboard' : 'Administrator Sign In'}</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#8A7768]">
            <span>{bundle.settings.course_label}</span>
            <span>© {new Date().getFullYear()} {bundle.settings.site_title}</span>
          </div>
        </div>
      </footer>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-[#241B15] text-[#FAF7F2] shadow-lg hover:bg-[#3B2D24] transition-colors focus-visible:outline-2 focus-visible:outline-[#7C4A2D]"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
