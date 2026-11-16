import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { ImageUploadControl } from '../ImageUploadControl';
import { ResilientImage } from '../ResilientImage';
import {
  deleteTimelineStage,
  persistTimelineOrder,
  saveTimelineStage,
} from '../../lib/autobiographyService';
import type { TimelineStage } from '../../types/autobiography';
import { reorderItems, sortByOrder } from '../../utils/editorial';

interface AdminTimelineTabProps {
  stages: TimelineStage[];
  onSaved: () => Promise<void>;
}

const EMPTY_STAGE: Omit<TimelineStage, 'id'> = {
  sort_order: 1,
  stage_title: '',
  age_or_year: '',
  story: '',
  memories: '',
  milestones: '',
  lessons_learned: '',
  reflection: '',
  cover_photo_url: '',
  is_published: true,
};

export function AdminTimelineTab({ stages, onSaved }: AdminTimelineTabProps) {
  const ordered = sortByOrder(stages);
  const [editing, setEditing] = useState<Partial<TimelineStage> | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const startNew = () => {
    setEditing({
      ...EMPTY_STAGE,
      sort_order: ordered.length + 1,
    });
    setStatus(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.stage_title?.trim()) {
      setStatus({ type: 'err', text: 'Stage title is required.' });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      await saveTimelineStage(editing);
      await onSaved();
      setEditing(null);
      setStatus({ type: 'ok', text: 'Timeline stage saved.' });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to save timeline stage.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleMove = async (index: number, dir: 'up' | 'down') => {
    setBusy(true);
    setStatus(null);
    try {
      const nextOrder = reorderItems(ordered, index, dir);
      await persistTimelineOrder(nextOrder);
      await onSaved();
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to reorder stages.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    setBusy(true);
    setStatus(null);
    try {
      await deleteTimelineStage(id);
      await onSaved();
      if (editing?.id === id) setEditing(null);
      setStatus({ type: 'ok', text: 'Timeline stage removed.' });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not delete timeline stage.',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DACD]">
        <div>
          <h2 className="font-editorial text-3xl font-semibold text-[#241B15]">
            Life Journey Timeline
          </h2>
          <p className="text-sm text-[#6E5C4E]">
            Add new stages, update memories and lessons, upload stage covers, or reorder chapters.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium hover:bg-[#3A2C23] self-start"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Life Stage</span>
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

      {editing && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4C6B5] space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-semibold text-[#241B15]">
              {editing.id ? `Edit: ${editing.stage_title}` : 'New Life Stage'}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-xs font-medium text-[#6E5C4E] hover:text-[#241B15]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="text-xs font-medium uppercase text-[#6E5C4E]">Stage Title</span>
              <input
                type="text"
                required
                value={editing.stage_title ?? ''}
                onChange={(e) => setEditing((s) => ({ ...s, stage_title: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium uppercase text-[#6E5C4E]">Age or Year</span>
              <input
                type="text"
                value={editing.age_or_year ?? ''}
                onChange={(e) => setEditing((s) => ({ ...s, age_or_year: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
              />
            </label>
          </div>

          <div className="space-y-2">
            {editing.cover_photo_url && (
              <div className="w-48 aspect-[4/3] rounded-lg overflow-hidden border border-[#E3DACD]">
                <ResilientImage
                  src={editing.cover_photo_url}
                  alt="Stage cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <ImageUploadControl
              label="Upload Stage Cover Photo"
              folder="timeline"
              onUploaded={({ publicUrl }) =>
                setEditing((s) => ({ ...s, cover_photo_url: publicUrl }))
              }
            />
          </div>

          {[
            { key: 'story', label: 'Personal Story', rows: 3 },
            { key: 'memories', label: 'Important Memories', rows: 2 },
            { key: 'milestones', label: 'Achievements & Milestones', rows: 2 },
            { key: 'lessons_learned', label: 'Lessons Learned', rows: 2 },
            { key: 'reflection', label: 'Personal Reflection', rows: 2 },
          ].map(({ key, label, rows }) => (
            <label key={key} className="block space-y-1">
              <span className="text-xs font-medium uppercase text-[#6E5C4E]">{label}</span>
              <textarea
                rows={rows}
                value={String(editing[key as keyof TimelineStage] ?? '')}
                onChange={(e) => setEditing((s) => ({ ...s, [key]: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
              />
            </label>
          ))}

          <label className="inline-flex items-center gap-2 text-sm text-[#241B15]">
            <input
              type="checkbox"
              checked={editing.is_published ?? true}
              onChange={(e) => setEditing((s) => ({ ...s, is_published: e.target.checked }))}
              className="rounded border-[#D4C6B5]"
            />
            <span>Visible on public Life Journey page</span>
          </label>

          <div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium hover:bg-[#3A2C23] disabled:opacity-50"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>{busy ? 'Saving...' : 'Save Stage'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {ordered.map((stage, idx) => (
          <div
            key={stage.id}
            className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E3DACD] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              {stage.cover_photo_url && (
                <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-[#EFE8DC]">
                  <ResilientImage
                    src={stage.cover_photo_url}
                    alt={stage.stage_title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs text-[#8A7768]">
                  Chapter {String(idx + 1).padStart(2, '0')} · {stage.age_or_year} ·{' '}
                  {stage.is_published ? 'Published' : 'Draft'}
                </p>
                <h3 className="font-editorial text-xl font-semibold text-[#241B15] truncate">
                  {stage.stage_title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={busy || idx === 0}
                onClick={() => void handleMove(idx, 'up')}
                aria-label={`Move ${stage.stage_title} up`}
                className="p-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] disabled:opacity-40"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={busy || idx === ordered.length - 1}
                onClick={() => void handleMove(idx, 'down')}
                aria-label={`Move ${stage.stage_title} down`}
                className="p-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] disabled:opacity-40"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setEditing(stage)}
                className="px-3 py-1.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-xs font-medium hover:bg-[#F1EAE0]"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleDelete(stage.id)}
                aria-label={`Delete ${stage.stage_title}`}
                className="p-2 rounded-lg text-[#8C2D1E] hover:bg-[#FDF2F0]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
