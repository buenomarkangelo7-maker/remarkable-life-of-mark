import { useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  Trash2,
} from 'lucide-react';
import { ImageUploadControl } from '../ImageUploadControl';
import { ResilientImage } from '../ResilientImage';
import {
  createPhotoRecord,
  deletePhotoRecord,
  persistPhotoOrder,
  updatePhotoRecord,
} from '../../lib/autobiographyService';
import {
  PHOTO_CATEGORIES,
  type PhotoItem,
  type SelfDimension,
  type SelfDimensionSlug,
  type TimelineStage,
} from '../../types/autobiography';
import { reorderItems, sortByOrder } from '../../utils/editorial';

interface AdminGalleryTabProps {
  photos: PhotoItem[];
  dimensions: SelfDimension[];
  timeline: TimelineStage[];
  onSaved: () => Promise<void>;
}

export function AdminGalleryTab({
  photos,
  dimensions,
  timeline,
  onSaved,
}: AdminGalleryTabProps) {
  const ordered = sortByOrder(photos);
  const [uploadCategory, setUploadCategory] = useState<string>(PHOTO_CATEGORIES[0]);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleMove = async (index: number, dir: 'up' | 'down') => {
    setStatus(null);
    try {
      const next = reorderItems(ordered, index, dir);
      await persistPhotoOrder(next);
      await onSaved();
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not reorder photographs.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E3DACD]">
        <h2 className="font-editorial text-3xl font-semibold text-[#241B15]">
          Photo Gallery Manager
        </h2>
        <p className="text-sm text-[#6E5C4E] mt-1">
          Photographs are compressed automatically before uploading to the Supabase “mark-photos” bucket. New uploads remain private drafts until you publish them.
        </p>

        <div className="mt-5 p-4 rounded-xl bg-[#FAF7F2] border border-[#E3DACD] space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-medium uppercase tracking-wider text-[#6E5C4E]">
              Default Upload Category
            </label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
            >
              {PHOTO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <ImageUploadControl
            label="Upload Photographs (Multi-Select)"
            folder="gallery"
            multiple
            helperText="JPG, PNG, or WebP · Compressed automatically to stay fast & free-tier friendly"
            onUploaded={async ({ publicUrl, storagePath, fileName }) => {
              await createPhotoRecord({
                url: publicUrl,
                storage_path: storagePath,
                title: fileName.replace(/\.[^.]+$/, ''),
                caption: '',
                description: '',
                category: uploadCategory,
                dimension_slug: null,
                timeline_stage_id: null,
                date_taken: '',
                location: '',
                sort_order: ordered.length + 1,
                is_published: false,
              });
              await onSaved();
              setStatus({
                type: 'ok',
                text: 'Photograph uploaded as Private Draft. Edit details and click Publish when ready.',
              });
            }}
          />
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

      <div className="space-y-4">
        {ordered.map((photo, idx) => (
          <GalleryPhotoEditorRow
            key={photo.id}
            photo={photo}
            index={idx}
            total={ordered.length}
            dimensions={dimensions}
            timeline={timeline}
            busy={busyId === photo.id}
            onMove={(dir) => void handleMove(idx, dir)}
            onSave={async (updates) => {
              setBusyId(photo.id);
              setStatus(null);
              try {
                await updatePhotoRecord(photo.id, updates);
                await onSaved();
                setStatus({
                  type: 'ok',
                  text: updates.is_published === true
                    ? `"${updates.title || photo.title || 'Photograph'}" is now published on the public website.`
                    : updates.is_published === false
                      ? `"${updates.title || photo.title || 'Photograph'}" moved to private drafts.`
                      : 'Photograph metadata saved.',
                });
              } catch (err) {
                setStatus({
                  type: 'err',
                  text: err instanceof Error ? err.message : 'Failed to update photograph.',
                });
              } finally {
                setBusyId(null);
              }
            }}
            onDelete={async () => {
              setBusyId(photo.id);
              setStatus(null);
              try {
                await deletePhotoRecord(photo);
                await onSaved();
                setStatus({ type: 'ok', text: 'Photograph removed from database and storage.' });
              } catch (err) {
                setStatus({
                  type: 'err',
                  text: err instanceof Error ? err.message : 'Could not delete photograph.',
                });
              } finally {
                setBusyId(null);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

function GalleryPhotoEditorRow({
  photo,
  index,
  total,
  dimensions,
  timeline,
  busy,
  onMove,
  onSave,
  onDelete,
}: {
  photo: PhotoItem;
  index: number;
  total: number;
  dimensions: SelfDimension[];
  timeline: TimelineStage[];
  busy: boolean;
  onMove: (dir: 'up' | 'down') => void;
  onSave: (updates: Partial<PhotoItem>) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [title, setTitle] = useState(photo.title);
  const [caption, setCaption] = useState(photo.caption);
  const [description, setDescription] = useState(photo.description);
  const [category, setCategory] = useState(photo.category);
  const [dateTaken, setDateTaken] = useState(photo.date_taken);
  const [location, setLocation] = useState(photo.location);
  const [dimensionSlug, setDimensionSlug] = useState<string>(photo.dimension_slug ?? '');
  const [stageId, setStageId] = useState<string>(photo.timeline_stage_id ?? '');

  const collectUpdates = (overridePublished?: boolean): Partial<PhotoItem> => ({
    title,
    caption,
    description,
    category,
    date_taken: dateTaken,
    location,
    dimension_slug: (dimensionSlug || null) as SelfDimensionSlug | null,
    timeline_stage_id: stageId || null,
    is_published: overridePublished ?? photo.is_published,
  });

  return (
    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E3DACD] grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
      <div className="md:col-span-3 space-y-2">
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#EFE8DC] border border-[#E3DACD]">
          <ResilientImage src={photo.url} alt={title || 'Photo'} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className={photo.is_published ? 'text-[#3D5235] font-medium' : 'text-[#8C5A2B] font-medium'}>
            {photo.is_published ? 'Published' : 'Private Draft'}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={busy || index === 0}
              onClick={() => onMove('up')}
              aria-label="Move photograph up"
              className="p-1.5 rounded border border-[#D4C6B5] bg-[#FFFDF9] disabled:opacity-40"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={busy || index === total - 1}
              onClick={() => onMove('down')}
              aria-label="Move photograph down"
              className="p-1.5 rounded border border-[#D4C6B5] bg-[#FFFDF9] disabled:opacity-40"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
        >
          {PHOTO_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="sm:col-span-2 px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
        />
        <textarea
          rows={2}
          placeholder="Description or story behind the photo..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="sm:col-span-2 px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
        />
        <input
          type="text"
          placeholder="Date (e.g. October 2026)"
          value={dateTaken}
          onChange={(e) => setDateTaken(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-xs"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-xs"
        />
        <select
          value={dimensionSlug}
          onChange={(e) => setDimensionSlug(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-xs"
        >
          <option value="">No Self Dimension link</option>
          {dimensions.map((d) => (
            <option key={d.slug} value={d.slug}>
              Dimension {d.letter_code}: {d.title}
            </option>
          ))}
        </select>
        <select
          value={stageId}
          onChange={(e) => setStageId(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-xs"
        >
          <option value="">No Timeline Stage link</option>
          {timeline.map((s) => (
            <option key={s.id} value={s.id}>
              {s.stage_title}
            </option>
          ))}
        </select>

        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void onSave(collectUpdates())}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-xs font-medium hover:bg-[#F1EAE0]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Details</span>
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void onSave(collectUpdates(!photo.is_published))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#241B15] text-[#FAF7F2] text-xs font-medium hover:bg-[#3A2C23]"
            >
              {photo.is_published ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Unpublish</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => void onDelete()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#8C2D1E] hover:bg-[#FDF2F0]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
