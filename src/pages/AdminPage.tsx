import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Camera,
  Check,
  Clock,
  Compass,
  Copy,
  Database,
  Heart,
  LayoutDashboard,
  Lock,
  LogOut,
  RefreshCw,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react';
import schemaSql from '../../supabase/schema.sql?raw';
import { AdminBlogTab } from '../components/admin/AdminBlogTab';
import { AdminDimensionsTab } from '../components/admin/AdminDimensionsTab';
import { AdminGalleryTab } from '../components/admin/AdminGalleryTab';
import {
  AdminProfileTab,
  AdminSettingsTab,
} from '../components/admin/AdminProfileAndSettingsTab';
import { AdminSpecialsTab } from '../components/admin/AdminSpecialsTab';
import { AdminTimelineTab } from '../components/admin/AdminTimelineTab';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { supabaseConfigInfo } from '../lib/supabaseClient';
import { computeAdminStats } from '../utils/editorial';

type AdminTab =
  | 'overview'
  | 'profile'
  | 'dimensions'
  | 'timeline'
  | 'blog'
  | 'gallery'
  | 'specials'
  | 'settings';

export function AdminPage() {
  const { user, isAdmin, loading: authLoading, authError, isConfigured, signIn, signOut } =
    useAuth();
  const { bundle, schemaMissing, refresh } = useContent();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [checkingSchema, setCheckingSchema] = useState(false);

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(schemaSql);
      setCopiedSql(true);
      window.setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      setCopiedSql(false);
    }
  };

  const handleRecheckSchema = async () => {
    setCheckingSchema(true);
    await refresh(false);
    setCheckingSchema(false);
  };

  useEffect(() => {
    document.title = `Administrator Dashboard – ${bundle.settings.site_title}`;
  }, [bundle.settings.site_title]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setLoginError(null);
    try {
      await signIn(email, password);
      await refresh(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setSigningIn(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center text-sm text-[#6E5C4E]">
        Verifying administrator session...
      </div>
    );
  }

  // Private Administrator Login Gate (Zero public signup)
  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] p-7 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-[#7C4A2D] font-semibold mb-3">
            <Lock className="w-4 h-4" aria-hidden="true" />
            <span>Private Administrator Access</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#241B15]">
            Administrator Sign In
          </h1>
          <p className="mt-2 text-sm text-[#5C4B40] leading-relaxed">
            Public visitors can explore your published autobiography freely. Only Mark’s authorized Supabase administrator account can edit pages, manage drafts, or upload photographs.
          </p>

          {isConfigured && schemaMissing && (
            <div className="mt-6 p-4 rounded-xl bg-[#FAF7F2] border border-[#D4C6B5] text-xs text-[#4A3B31] space-y-3">
              <div className="flex items-center gap-2 font-semibold text-[#241B15]">
                <Database className="w-4 h-4 text-[#7C4A2D]" aria-hidden="true" />
                <span>Supabase Connected — Final Setup Step</span>
              </div>
              <p className="leading-relaxed">
                Your Supabase URL and key are active, but the database tables and <code className="px-1 py-0.5 rounded bg-[#EFE8DC]">mark-photos</code> bucket have not been created yet.
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[#5C4B40]">
                <li>Copy the SQL script below and run it in Supabase Dashboard → <strong>SQL Editor</strong>.</li>
                <li>Create your admin account in Supabase → <strong>Authentication → Users</strong> (and disable public signups).</li>
              </ol>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => void handleCopySql()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#241B15] text-[#FAF7F2] font-medium hover:bg-[#3A2C23] transition-colors"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied schema.sql' : 'Copy Schema SQL'}</span>
                </button>
                <button
                  type="button"
                  disabled={checkingSchema}
                  onClick={() => void handleRecheckSchema()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-[#241B15] font-medium hover:bg-[#F1EAE0] transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checkingSchema ? 'animate-spin' : ''}`} />
                  <span>{checkingSchema ? 'Checking...' : 'Re-check Tables'}</span>
                </button>
              </div>
            </div>
          )}

          {!isConfigured && (
            <div className="mt-6 p-4 rounded-xl bg-[#FAF7F2] border border-[#D8CCBC] text-xs text-[#4A3B31] space-y-2">
              <p className="font-semibold text-[#241B15]">
                Supabase Free Connection Status
              </p>
              <ul className="space-y-1">
                <li>
                  • <code className="px-1 py-0.5 rounded bg-[#EFE8DC]">VITE_SUPABASE_URL</code>:{' '}
                  <span className={supabaseConfigInfo.hasUrl ? 'text-[#3D5235] font-semibold' : 'text-[#8C2D1E] font-semibold'}>
                    {supabaseConfigInfo.hasUrl ? 'Connected' : 'Missing'}
                  </span>
                </li>
                <li>
                  • <code className="px-1 py-0.5 rounded bg-[#EFE8DC]">VITE_SUPABASE_ANON_KEY</code> (or{' '}
                  <code className="px-1 py-0.5 rounded bg-[#EFE8DC]">VITE_SUPABASE_PUBLISHABLE_KEY</code>):{' '}
                  <span className={supabaseConfigInfo.hasKey ? 'text-[#3D5235] font-semibold' : 'text-[#8C2D1E] font-semibold'}>
                    {supabaseConfigInfo.hasKey ? 'Connected' : 'Missing'}
                  </span>
                </li>
              </ul>
              <p>
                Add both public keys in <code className="px-1 py-0.5 rounded bg-[#EFE8DC]">.env</code> or AI Studio Secrets (never the service-role key), run{' '}
                <code className="px-1 py-0.5 rounded bg-[#EFE8DC]">supabase/schema.sql</code> in Supabase SQL Editor, and create your private admin user in Supabase Authentication.
              </p>
              <p className="text-[#6E5C4E]">
                See <code className="px-1 py-0.5 rounded bg-[#EFE8DC]">DEPLOYMENT.md</code> for the full step-by-step zero-budget guide.
              </p>
            </div>
          )}

          {(loginError || authError) && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2 p-3.5 rounded-lg bg-[#FDF2F0] border border-[#E6B8B0] text-xs text-[#8C2D1E]"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{loginError || authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6E5C4E]">
                Administrator Email
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buenomarkangelo7@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FAF7F2] text-sm text-[#241B15]"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6E5C4E]">
                Password
              </span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter administrator password"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FAF7F2] text-sm text-[#241B15]"
              />
            </label>

            <button
              type="submit"
              disabled={signingIn || !isConfigured}
              className="w-full py-3 px-4 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium hover:bg-[#3A2C23] transition-colors disabled:opacity-50"
            >
              {signingIn ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="mt-5 text-xs text-[#8A7768] text-center">
            Public registration is disabled. Accounts are managed exclusively in Supabase Auth.
          </p>
        </div>
      </div>
    );
  }

  const stats = computeAdminStats(bundle.photos, bundle.posts, bundle.timeline);

  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] =
    [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'profile', label: 'About Me', icon: User },
      { id: 'dimensions', label: '8 Dimensions', icon: Compass },
      { id: 'timeline', label: 'Timeline', icon: Clock },
      { id: 'blog', label: 'Blog & Drafts', icon: BookOpen },
      { id: 'gallery', label: 'Photo Gallery', icon: Camera },
      { id: 'specials', label: 'Then & Now / Letter', icon: Heart },
      { id: 'settings', label: 'Site Settings', icon: Settings },
    ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3DACD] mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-[#55634E] font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Authenticated Administrator · {user?.email}</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#241B15]">
            Autobiography Studio
          </h1>
        </div>

        <button
          type="button"
          onClick={() => void signOut()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm font-medium text-[#241B15] hover:bg-[#F1EAE0] self-start"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-3">
          <nav aria-label="Administrator sections" className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'bg-[#241B15] text-[#FAF7F2]'
                      : 'text-[#4A3B31] hover:bg-[#F1EAE0]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="lg:col-span-9 rounded-2xl bg-[#FFFDF9] border border-[#E3DACD] p-6 sm:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-editorial text-3xl font-semibold text-[#241B15]">
                  Dashboard Overview
                </h2>
                <p className="mt-1 text-sm text-[#6E5C4E]">
                  Live summary of your published autobiography and private drafts in Supabase.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Photographs', value: stats.totalPhotos },
                  { label: 'Published Photos', value: stats.publishedPhotos },
                  { label: 'Total Blog Posts', value: stats.totalPosts },
                  { label: 'Published Posts', value: stats.publishedPosts },
                  { label: 'Private Drafts', value: stats.draftPosts },
                  { label: 'Timeline Stages', value: stats.timelineStages },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-5 rounded-xl bg-[#FAF7F2] border border-[#E3DACD]"
                  >
                    <p className="text-xs uppercase tracking-wider text-[#8A7768]">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-editorial text-4xl font-semibold tabular-nums text-[#241B15]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E3DACD]">
                <h3 className="text-xs uppercase tracking-[0.18em] text-[#8A7768] font-semibold mb-3">
                  Quick Management Shortcuts
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('gallery')}
                    className="px-4 py-2 rounded-lg bg-[#241B15] text-[#FAF7F2] text-xs font-medium"
                  >
                    Upload Photographs
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('blog')}
                    className="px-4 py-2 rounded-lg border border-[#D4C6B5] bg-[#FAF7F2] text-xs font-medium"
                  >
                    Write Blog Reflection
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('dimensions')}
                    className="px-4 py-2 rounded-lg border border-[#D4C6B5] bg-[#FAF7F2] text-xs font-medium"
                  >
                    Edit 8 Self Dimensions
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="px-4 py-2 rounded-lg border border-[#D4C6B5] bg-[#FAF7F2] text-xs font-medium"
                  >
                    Update About Me
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <AdminProfileTab profile={bundle.profile} onSaved={() => refresh(true)} />
          )}

          {activeTab === 'dimensions' && (
            <AdminDimensionsTab
              dimensions={bundle.dimensions}
              photos={bundle.photos}
              onSaved={() => refresh(true)}
            />
          )}

          {activeTab === 'timeline' && (
            <AdminTimelineTab stages={bundle.timeline} onSaved={() => refresh(true)} />
          )}

          {activeTab === 'blog' && (
            <AdminBlogTab posts={bundle.posts} onSaved={() => refresh(true)} />
          )}

          {activeTab === 'gallery' && (
            <AdminGalleryTab
              photos={bundle.photos}
              dimensions={bundle.dimensions}
              timeline={bundle.timeline}
              onSaved={() => refresh(true)}
            />
          )}

          {activeTab === 'specials' && (
            <AdminSpecialsTab
              thenAndNow={bundle.thenAndNow}
              letter={bundle.letter}
              onSaved={() => refresh(true)}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab settings={bundle.settings} onSaved={() => refresh(true)} />
          )}
        </section>
      </div>
    </div>
  );
}
