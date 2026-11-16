import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { ImageUploadControl } from '../ImageUploadControl';
import { ResilientImage } from '../ResilientImage';
import { updateProfile, updateSiteSettings } from '../../lib/autobiographyService';
import type { ProfileData, SiteSettings } from '../../types/autobiography';

export function AdminProfileTab({
  profile,
  onSaved,
}: {
  profile: ProfileData;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState<ProfileData>(profile);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await updateProfile(form);
      await onSaved();
      setStatus({ type: 'ok', text: 'About Me profile saved to Supabase.' });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to save profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DACD]">
        <div>
          <h2 className="font-editorial text-3xl font-semibold text-[#241B15]">
            Profile & About Me
          </h2>
          <p className="text-sm text-[#6E5C4E]">
            Update your personal biography, values, goals, and portrait photograph.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium hover:bg-[#3A2C23] disabled:opacity-50"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      {status && (
        <div
          role="status"
          className={`flex items-center gap-2 p-3.5 rounded-lg text-sm ${
            status.type === 'ok'
              ? 'bg-[#F2F6F0] border border-[#C6D4BF] text-[#3D5235]'
              : 'bg-[#FDF2F0] border border-[#E6B8B0] text-[#8C2D1E]'
          }`}
        >
          {status.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{status.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4 space-y-3">
          <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[#E3DACD] bg-[#EFE8DC]">
            <ResilientImage
              src={form.avatar_url}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          </div>
          <ImageUploadControl
            label="Upload Profile Photo"
            folder="profile"
            onUploaded={({ publicUrl }) => setForm((f) => ({ ...f, avatar_url: publicUrl }))}
          />
        </div>

        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'full_name', label: 'Full Name' },
            { key: 'age', label: 'Age' },
            { key: 'education', label: 'Educational Background' },
            { key: 'personality', label: 'Personality' },
          ].map(({ key, label }) => (
            <label key={key} className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6E5C4E]">
                {label}
              </span>
              <input
                type="text"
                value={String(form[key as keyof ProfileData] ?? '')}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm text-[#241B15]"
              />
            </label>
          ))}

          {[
            { key: 'hobbies', label: 'Hobbies & Interests', rows: 2 },
            { key: 'values_beliefs', label: 'Values & Beliefs', rows: 2 },
            { key: 'life_philosophy', label: 'Philosophy in Life', rows: 3 },
            { key: 'personal_goals', label: 'Personal Goals', rows: 2 },
            { key: 'future_aspirations', label: 'Future Aspirations', rows: 2 },
            { key: 'personal_quote', label: 'Personal Quote', rows: 2 },
            { key: 'intro_text', label: 'Page Introduction', rows: 2 },
            { key: 'short_bio', label: 'Short Biography', rows: 4 },
          ].map(({ key, label, rows }) => (
            <label key={key} className="block space-y-1.5 sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6E5C4E]">
                {label}
              </span>
              <textarea
                rows={rows}
                value={String(form[key as keyof ProfileData] ?? '')}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm text-[#241B15] leading-relaxed"
              />
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}

export function AdminSettingsTab({
  settings,
  onSaved,
}: {
  settings: SiteSettings;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await updateSiteSettings(form);
      await onSaved();
      setStatus({ type: 'ok', text: 'Website settings saved to Supabase.' });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to save settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DACD]">
        <div>
          <h2 className="font-editorial text-3xl font-semibold text-[#241B15]">
            Website Settings & Homepage Hero
          </h2>
          <p className="text-sm text-[#6E5C4E]">
            Replace the featured homepage photograph, edit introductions, and manage footer text.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium hover:bg-[#3A2C23] disabled:opacity-50"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {status && (
        <div
          role="status"
          className={`flex items-center gap-2 p-3.5 rounded-lg text-sm ${
            status.type === 'ok'
              ? 'bg-[#F2F6F0] border border-[#C6D4BF] text-[#3D5235]'
              : 'bg-[#FDF2F0] border border-[#E6B8B0] text-[#8C2D1E]'
          }`}
        >
          {status.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{status.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4 space-y-3">
          <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[#E3DACD] bg-[#EFE8DC]">
            <ResilientImage
              src={form.hero_photo_url}
              alt="Homepage featured photo"
              className="w-full h-full object-cover"
            />
          </div>
          <ImageUploadControl
            label="Replace Hero Photograph"
            folder="hero"
            onUploaded={({ publicUrl }) => setForm((f) => ({ ...f, hero_photo_url: publicUrl }))}
          />
        </div>

        <div className="md:col-span-8 space-y-4">
          {[
            { key: 'site_title', label: 'Website Title', rows: 1 },
            { key: 'course_label', label: 'Course / Header Kicker', rows: 1 },
            { key: 'tagline', label: 'Main Tagline', rows: 2 },
            { key: 'hero_intro', label: 'Homepage Introduction', rows: 3 },
            { key: 'intro_statement', label: 'Prologue Statement', rows: 3 },
            { key: 'hero_photo_caption', label: 'Hero Photo Caption', rows: 2 },
            { key: 'footer_quote', label: 'Footer Quote', rows: 2 },
            { key: 'footer_note', label: 'Footer Attribution Note', rows: 2 },
          ].map(({ key, label, rows }) => (
            <label key={key} className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6E5C4E]">
                {label}
              </span>
              {rows === 1 ? (
                <input
                  type="text"
                  value={String(form[key as keyof SiteSettings] ?? '')}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm text-[#241B15]"
                />
              ) : (
                <textarea
                  rows={rows}
                  value={String(form[key as keyof SiteSettings] ?? '')}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm text-[#241B15] leading-relaxed"
                />
              )}
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}
