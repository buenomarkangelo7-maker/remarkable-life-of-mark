import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import { ImageUploadControl } from '../ImageUploadControl';
import { ResilientImage } from '../ResilientImage';
import {
  createPhotoRecord,
  deletePhotoRecord,
  updatePhotoRecord,
  updateSelfDimension,
} from '../../lib/autobiographyService';
import type { PhotoItem, SelfDimension } from '../../types/autobiography';

interface AdminDimensionsTabProps {
  dimensions: SelfDimension[];
  photos: PhotoItem[];
  onSaved: () => Promise<void>;
}

export function AdminDimensionsTab({
  dimensions,
  photos,
  onSaved,
}: AdminDimensionsTabProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(dimensions[0]?.slug ?? 'material');
  const current = dimensions.find((d) => d.slug === selectedSlug) ?? dimensions[0];

  const [form, setForm] = useState<SelfDimension>(current);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (current) {
      setForm(current);
      setStatus(null);
    }
  }, [current]);

  if (!current) return null;

  const linkedPhotos = photos.filter((p) => p.dimension_slug === current.slug);

  const handleSaveDimension = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await updateSelfDimension(current.slug, {
        title: form.title,
        subtitle: form.subtitle,
        intro_description: form.intro_description,
        featured_photo_url: form.featured_photo_url,
        reflection_content: form.reflection_content,
      });
      await onSaved();
      setStatus({ type: 'ok', text: `${form.title} updated successfully.` });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to save dimension.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#E3DACD]">
        <h2 className="font-editorial text-3xl font-semibold text-[#241B15]">
          Eight Dimensions of the Self
        </h2>
        <p className="text-sm text-[#6E5C4E] mt-1">
          Select a dimension to edit its header, reflection essay, featured photo, and linked photo gallery.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {dimensions.map((d) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => setSelectedSlug(d.slug)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                d.slug === current.slug
                  ? 'bg-[#241B15] text-[#FAF7F2]'
                  : 'bg-[#FAF7F2] border border-[#E3DACD] text-[#4A3B31] hover:bg-[#F1EAE0]'
              }`}
            >
              {d.letter_code}. {d.title}
            </button>
          ))}
        </div>
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

      <form onSubmit={handleSaveDimension} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-3">
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E3DACD] bg-[#EFE8DC]">
            <ResilientImage
              src={form.featured_photo_url}
              alt={form.title}
              className="w-full h-full object-cover"
            />
          </div>
          <ImageUploadControl
            label="Replace Featured Photo"
            folder={`dimensions/${current.slug}`}
            onUploaded={({ publicUrl }) =>
              setForm((f) => ({ ...f, featured_photo_url: publicUrl }))
            }
          />
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6E5C4E]">
                Dimension Title
              </span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6E5C4E]">
                Subtitle
              </span>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-[#6E5C4E]">
              Introductory Description
            </span>
            <textarea
              rows={2}
              value={form.intro_description}
              onChange={(e) =>
                setForm((f) => ({ ...f, intro_description: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-[#6E5C4E]">
              Personal Reflection
            </span>
            <textarea
              rows={6}
              value={form.reflection_content}
              onChange={(e) =>
                setForm((f) => ({ ...f, reflection_content: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm leading-relaxed"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium hover:bg-[#3A2C23] disabled:opacity-50"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>{saving ? 'Saving...' : `Save ${form.title}`}</span>
          </button>
        </div>
      </form>

      {/* Dimension-Linked Photographs */}
      <div className="pt-6 border-t border-[#E3DACD] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-editorial text-2xl font-semibold text-[#241B15]">
              {form.title} Gallery Photos ({linkedPhotos.length})
            </h3>
            <p className="text-xs text-[#6E5C4E]">
              New uploads stay private as drafts until you click Publish.
            </p>
          </div>
          <ImageUploadControl
            label="Add Dimension Photos"
            folder={`dimensions/${current.slug}`}
            multiple
            onUploaded={async ({ publicUrl, storagePath, fileName }) => {
              await createPhotoRecord({
                url: publicUrl,
                storage_path: storagePath,
                title: fileName.replace(/\.[^.]+$/, ''),
                caption: '',
                description: '',
                category: 'Self Dimensions',
                dimension_slug: current.slug,
                timeline_stage_id: null,
                date_taken: '',
                location: '',
                sort_order: photos.length + 1,
                is_published: false,
              });
              await onSaved();
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {linkedPhotos.map((photo) => (
            <DimensionPhotoCard
              key={photo.id}
              photo={photo}
              onSaved={onSaved}
              onError={(msg) => setStatus({ type: 'err', text: msg })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DimensionPhotoCard({
  photo,
  onSaved,
  onError,
}: {
  photo: PhotoItem;
  onSaved: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [caption, setCaption] = useState(photo.caption);
  const [dateTaken, setDateTaken] = useState(photo.date_taken);
  const [location, setLocation] = useState(photo.location);
  const [busy, setBusy] = useState(false);

  const saveMeta = async (nextPublished?: boolean) => {
    setBusy(true);
    try {
      await updatePhotoRecord(photo.id, {
        caption,
        date_taken: dateTaken,
        location,
        is_published: nextPublished ?? photo.is_published,
      });
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not update photo.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await deletePhotoRecord(photo);
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not delete photo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E3DACD] flex gap-4">
      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-[#EFE8DC]">
        <ResilientImage src={photo.url} alt={photo.title || 'Photo'} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#5C4B40]">
            {photo.is_published ? 'Published' : 'Private Draft'}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={busy}
              onClick={() => void saveMeta(!photo.is_published)}
              className="px-2.5 py-1 rounded text-xs font-medium border border-[#D4C6B5] bg-[#FFFDF9] hover:bg-[#F1EAE0]"
            >
              {photo.is_published ? (
                <span className="inline-flex items-center gap-1">
                  <EyeOff className="w-3 h-3" /> Unpublish
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Publish
                </span>
              )}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void remove()}
              aria-label="Delete photograph"
              className="p-1.5 rounded text-[#8C2D1E] hover:bg-[#FDF2F0]"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded border border-[#D4C6B5] bg-[#FFFDF9] text-xs"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Date / Year"
            value={dateTaken}
            onChange={(e) => setDateTaken(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded border border-[#D4C6B5] bg-[#FFFDF9] text-xs"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded border border-[#D4C6B5] bg-[#FFFDF9] text-xs"
          />
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void saveMeta()}
          className="text-xs font-medium text-[#7C4A2D] hover:underline"
        >
          Save caption & metadata
        </button>
      </div>
    </div>
  );
}
