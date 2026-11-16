import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { ImageUploadControl } from '../ImageUploadControl';
import { ResilientImage } from '../ResilientImage';
import { deleteBlogPost, saveBlogPost } from '../../lib/autobiographyService';
import {
  BLOG_CATEGORIES,
  type AdditionalBlogPhoto,
  type BlogCategory,
  type BlogPost,
} from '../../types/autobiography';
import { formatEditorialDate, slugifyTitle } from '../../utils/editorial';

interface AdminBlogTabProps {
  posts: BlogPost[];
  onSaved: () => Promise<void>;
}

export function AdminBlogTab({ posts, onSaved }: AdminBlogTabProps) {
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const startNew = () => {
    setEditing({
      title: '',
      slug: '',
      category: 'Personal Growth',
      short_description: '',
      content: '',
      featured_photo_url: '',
      additional_photos: [],
      is_published: false,
    });
    setStatus(null);
  };

  const handleSave = async (publishState?: boolean) => {
    if (!editing?.title?.trim() || !editing?.content?.trim()) {
      setStatus({ type: 'err', text: 'Title and full article content are required.' });
      return;
    }

    setBusy(true);
    setStatus(null);
    try {
      const nextPublished = publishState ?? editing.is_published ?? false;
      const slug = editing.slug?.trim() || slugifyTitle(editing.title);
      await saveBlogPost({
        ...editing,
        slug,
        is_published: nextPublished,
      });
      await onSaved();
      setEditing(null);
      setStatus({
        type: 'ok',
        text: nextPublished
          ? 'Blog post published and immediately visible on the public website.'
          : 'Blog post saved privately as a draft.',
      });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to save blog post.',
      });
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (post: BlogPost) => {
    setBusy(true);
    setStatus(null);
    try {
      await saveBlogPost({
        id: post.id,
        slug: post.slug,
        title: post.title,
        category: post.category,
        short_description: post.short_description,
        content: post.content,
        featured_photo_url: post.featured_photo_url,
        additional_photos: post.additional_photos,
        is_published: !post.is_published,
      });
      await onSaved();
      setStatus({
        type: 'ok',
        text: !post.is_published
          ? `"${post.title}" is now published.`
          : `"${post.title}" moved back to private drafts.`,
      });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to update publish status.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    setBusy(true);
    setStatus(null);
    try {
      await deleteBlogPost(post.id);
      await onSaved();
      if (editing?.id === post.id) setEditing(null);
      setStatus({ type: 'ok', text: `Deleted "${post.title}".` });
    } catch (err) {
      setStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not delete blog post.',
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
            Blog & Reflections Manager
          </h2>
          <p className="text-sm text-[#6E5C4E]">
            Write drafts privately, attach captioned photographs, and publish when ready.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium hover:bg-[#3A2C23] self-start"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>New Article</span>
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
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4C6B5] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-semibold text-[#241B15]">
              {editing.id ? `Editing: ${editing.title}` : 'Compose New Reflection'}
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
              <span className="text-xs font-medium uppercase text-[#6E5C4E]">Article Title</span>
              <input
                type="text"
                value={editing.title ?? ''}
                onChange={(e) => {
                  const title = e.target.value;
                  setEditing((p) => ({
                    ...p,
                    title,
                    slug: p?.id ? p.slug : slugifyTitle(title),
                  }));
                }}
                className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-medium uppercase text-[#6E5C4E]">Category</span>
              <select
                value={editing.category ?? 'Personal Growth'}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, category: e.target.value as BlogCategory }))
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block space-y-1">
            <span className="text-xs font-medium uppercase text-[#6E5C4E]">URL Slug</span>
            <input
              type="text"
              value={editing.slug ?? ''}
              onChange={(e) => setEditing((p) => ({ ...p, slug: slugifyTitle(e.target.value) }))}
              className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-xs font-mono"
            />
          </label>

          <div className="space-y-2">
            <span className="block text-xs font-medium uppercase text-[#6E5C4E]">
              Featured Photograph
            </span>
            {editing.featured_photo_url && (
              <div className="w-64 aspect-[16/10] rounded-lg overflow-hidden border border-[#E3DACD]">
                <ResilientImage
                  src={editing.featured_photo_url}
                  alt="Featured post preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <ImageUploadControl
              label="Upload Featured Photo"
              folder="blog"
              onUploaded={({ publicUrl }) =>
                setEditing((p) => ({ ...p, featured_photo_url: publicUrl }))
              }
            />
          </div>

          <label className="block space-y-1">
            <span className="text-xs font-medium uppercase text-[#6E5C4E]">
              Short Description / Deck
            </span>
            <textarea
              rows={2}
              value={editing.short_description ?? ''}
              onChange={(e) => setEditing((p) => ({ ...p, short_description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-medium uppercase text-[#6E5C4E]">
              Full Article Content
            </span>
            <textarea
              rows={9}
              value={editing.content ?? ''}
              onChange={(e) => setEditing((p) => ({ ...p, content: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-sm leading-relaxed"
            />
          </label>

          {/* Additional Captioned Photographs */}
          <div className="space-y-3 pt-2 border-t border-[#E3DACD]">
            <span className="block text-xs font-medium uppercase text-[#6E5C4E]">
              Additional Article Photographs ({(editing.additional_photos ?? []).length})
            </span>
            <ImageUploadControl
              label="Attach Additional Photos"
              folder="blog/gallery"
              multiple
              onUploaded={({ publicUrl, storagePath }) =>
                setEditing((p) => ({
                  ...p,
                  additional_photos: [
                    ...(p?.additional_photos ?? []),
                    { url: publicUrl, caption: '', storage_path: storagePath },
                  ],
                }))
              }
            />
            {(editing.additional_photos ?? []).map((item: AdditionalBlogPhoto, idx: number) => (
              <div key={`${item.url}-${idx}`} className="flex items-center gap-3">
                <div className="w-16 h-12 rounded overflow-hidden shrink-0 bg-[#EFE8DC]">
                  <ResilientImage src={item.url} alt="Attachment" className="w-full h-full object-cover" />
                </div>
                <input
                  type="text"
                  placeholder="Photograph caption..."
                  value={item.caption}
                  onChange={(e) => {
                    const next = [...(editing.additional_photos ?? [])];
                    next[idx] = { ...next[idx], caption: e.target.value };
                    setEditing((p) => ({ ...p, additional_photos: next }));
                  }}
                  className="flex-1 px-3 py-2 rounded border border-[#D4C6B5] bg-[#FFFDF9] text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    setEditing((p) => ({
                      ...p,
                      additional_photos: (p?.additional_photos ?? []).filter((_, i) => i !== idx),
                    }))
                  }
                  aria-label="Remove attachment"
                  className="p-2 text-[#8C2D1E] hover:bg-[#FDF2F0] rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleSave(false)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#CDBEAC] bg-[#FFFDF9] text-sm font-medium text-[#241B15] hover:bg-[#F1EAE0]"
            >
              <Save className="w-4 h-4" />
              <span>Save as Private Draft</span>
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleSave(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#241B15] text-[#FAF7F2] text-sm font-medium hover:bg-[#3A2C23]"
            >
              <Eye className="w-4 h-4" />
              <span>Publish Article</span>
            </button>
          </div>
        </div>
      )}

      {/* Existing Posts List */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E3DACD] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A7768]">
                <span className="font-medium text-[#7C4A2D]">{post.category}</span>
                <span aria-hidden="true">·</span>
                <span className={post.is_published ? 'text-[#3D5235] font-medium' : 'text-[#8C5A2B] font-medium'}>
                  {post.is_published ? 'Published' : 'Private Draft'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{formatEditorialDate(post.published_at || post.created_at)}</span>
              </div>
              <h3 className="mt-1 font-editorial text-xl font-semibold text-[#241B15] truncate">
                {post.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={busy}
                onClick={() => void togglePublish(post)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-xs font-medium hover:bg-[#F1EAE0]"
              >
                {post.is_published ? (
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
              <button
                type="button"
                onClick={() => setEditing(post)}
                className="px-3 py-1.5 rounded-lg border border-[#D4C6B5] bg-[#FFFDF9] text-xs font-medium hover:bg-[#F1EAE0]"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleDelete(post)}
                aria-label={`Delete ${post.title}`}
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
