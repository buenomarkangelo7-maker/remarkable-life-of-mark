import type {
  AdminOverviewStats,
  BlogPost,
  PhotoItem,
  TimelineStage,
} from '../types/autobiography';

/**
 * Converts any article title into a clean, URL-safe slug.
 */
export function slugifyTitle(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return base || 'untitled-reflection';
}

/**
 * Estimates reading time in minutes at ~200 words per minute.
 */
export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Formats ISO timestamps cleanly for editorial display.
 */
export function formatEditorialDate(isoOrString: string | null | undefined): string {
  if (!isoOrString) return 'Unpublished Draft';
  const parsed = new Date(isoOrString);
  if (Number.isNaN(parsed.getTime())) {
    return isoOrString;
  }
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Sorts ordered collections (dimensions, timeline stages, gallery items) safely.
 */
export function sortByOrder<T extends { sort_order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Moves an item one position up or down and returns normalized sequential sort_order values.
 */
export function reorderItems<T extends { sort_order: number }>(
  items: T[],
  index: number,
  direction: 'up' | 'down'
): T[] {
  const sorted = sortByOrder(items);
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || index >= sorted.length || targetIndex < 0 || targetIndex >= sorted.length) {
    return sorted;
  }
  const copy = [...sorted];
  const [moved] = copy.splice(index, 1);
  copy.splice(targetIndex, 0, moved);
  return copy.map((item, idx) => ({
    ...item,
    sort_order: idx + 1,
  }));
}

/**
 * Enforces public visibility rules on client state in tandem with Supabase RLS.
 */
export function filterPublishedPosts(posts: BlogPost[], isAdminView = false): BlogPost[] {
  const visible = isAdminView ? posts : posts.filter((p) => p.is_published);
  return [...visible].sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at).getTime();
    const dateB = new Date(b.published_at || b.created_at).getTime();
    return dateB - dateA;
  });
}

export function filterPublishedPhotos(photos: PhotoItem[], isAdminView = false): PhotoItem[] {
  const visible = isAdminView ? photos : photos.filter((p) => p.is_published);
  return sortByOrder(visible);
}

export function filterPublishedTimeline(
  stages: TimelineStage[],
  isAdminView = false
): TimelineStage[] {
  const visible = isAdminView ? stages : stages.filter((s) => s.is_published);
  return sortByOrder(visible);
}

export function computeAdminStats(
  photos: PhotoItem[],
  posts: BlogPost[],
  timeline: TimelineStage[]
): AdminOverviewStats {
  const publishedPosts = posts.filter((p) => p.is_published).length;
  return {
    totalPhotos: photos.length,
    publishedPhotos: photos.filter((p) => p.is_published).length,
    totalPosts: posts.length,
    publishedPosts,
    draftPosts: posts.length - publishedPosts,
    timelineStages: timeline.length,
  };
}
