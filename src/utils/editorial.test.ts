import test from 'node:test';
import assert from 'node:assert/strict';
import {
  slugifyTitle,
  estimateReadingTime,
  reorderItems,
  filterPublishedPosts,
  filterPublishedPhotos,
  computeAdminStats,
} from './editorial';
import type { BlogPost, PhotoItem, TimelineStage } from '../types/autobiography';

test('slugifyTitle normalizes punctuation and whitespace', () => {
  assert.equal(slugifyTitle('  Learning Who I Am: Chapter 1!  '), 'learning-who-i-am-chapter-1');
  assert.equal(slugifyTitle('!!!'), 'untitled-reflection');
});

test('estimateReadingTime computes minimum 1 minute', () => {
  assert.equal(estimateReadingTime('Short note'), 1);
  const longText = Array.from({ length: 450 }, () => 'memory').join(' ');
  assert.equal(estimateReadingTime(longText), 3);
});

test('reorderItems swaps adjacent elements and normalizes sort_order', () => {
  const items = [
    { id: 'a', sort_order: 1 },
    { id: 'b', sort_order: 2 },
    { id: 'c', sort_order: 3 },
  ];
  const movedUp = reorderItems(items, 2, 'up');
  assert.deepEqual(
    movedUp.map((i) => ({ id: i.id, sort_order: i.sort_order })),
    [
      { id: 'a', sort_order: 1 },
      { id: 'c', sort_order: 2 },
      { id: 'b', sort_order: 3 },
    ]
  );

  // Boundary move does nothing
  const unchanged = reorderItems(items, 0, 'up');
  assert.deepEqual(unchanged.map((i) => i.id), ['a', 'b', 'c']);
});

test('filterPublishedPosts excludes drafts for public visitors', () => {
  const posts: BlogPost[] = [
    {
      id: '1',
      slug: 'draft-secret',
      title: 'Private Draft',
      category: 'Personal Thoughts',
      short_description: 'Private',
      content: 'Body',
      featured_photo_url: '',
      additional_photos: [],
      is_published: false,
      published_at: null,
      created_at: '2026-11-15T10:00:00Z',
      updated_at: '2026-11-15T10:00:00Z',
    },
    {
      id: '2',
      slug: 'public-story',
      title: 'Public Story',
      category: 'Memories',
      short_description: 'Public',
      content: 'Body',
      featured_photo_url: '',
      additional_photos: [],
      is_published: true,
      published_at: '2026-11-14T10:00:00Z',
      created_at: '2026-11-14T10:00:00Z',
      updated_at: '2026-11-14T10:00:00Z',
    },
  ];

  const publicOnly = filterPublishedPosts(posts, false);
  assert.equal(publicOnly.length, 1);
  assert.equal(publicOnly[0].slug, 'public-story');

  const adminView = filterPublishedPosts(posts, true);
  assert.equal(adminView.length, 2);
});

test('filterPublishedPhotos hides unpublished uploads until explicitly published', () => {
  const photos: PhotoItem[] = [
    {
      id: 'p1',
      url: '/a.jpg',
      storage_path: 'gallery/a.jpg',
      title: 'Draft Upload',
      caption: '',
      description: '',
      category: 'Childhood',
      dimension_slug: null,
      timeline_stage_id: null,
      date_taken: '',
      location: '',
      sort_order: 1,
      is_published: false,
      created_at: '2026-11-15T00:00:00Z',
    },
    {
      id: 'p2',
      url: '/b.jpg',
      storage_path: 'gallery/b.jpg',
      title: 'Published Photo',
      caption: '',
      description: '',
      category: 'Childhood',
      dimension_slug: null,
      timeline_stage_id: null,
      date_taken: '',
      location: '',
      sort_order: 2,
      is_published: true,
      created_at: '2026-11-15T00:00:00Z',
    },
  ];

  assert.equal(filterPublishedPhotos(photos, false).length, 1);
  assert.equal(filterPublishedPhotos(photos, true).length, 2);
});

test('computeAdminStats accurately summarizes published vs draft counts', () => {
  const posts = [
    { is_published: true } as BlogPost,
    { is_published: false } as BlogPost,
    { is_published: true } as BlogPost,
  ];
  const photos = [
    { is_published: true } as PhotoItem,
    { is_published: false } as PhotoItem,
  ];
  const timeline = [{ id: '1' } as TimelineStage, { id: '2' } as TimelineStage];

  const stats = computeAdminStats(photos, posts, timeline);
  assert.deepEqual(stats, {
    totalPhotos: 2,
    publishedPhotos: 1,
    totalPosts: 3,
    publishedPosts: 2,
    draftPosts: 1,
    timelineStages: 2,
  });
});
