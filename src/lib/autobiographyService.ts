import {
  DEFAULT_BUNDLE,
  DEFAULT_DIMENSIONS,
  DEFAULT_LETTER,
  DEFAULT_PROFILE,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_THEN_AND_NOW,
} from '../data/defaultSeed';
import type {
  AutobiographyBundle,
  BlogPost,
  PhotoItem,
  ProfileData,
  SelfDimension,
  SiteSettings,
  ThenAndNowData,
  TimelineStage,
  YoungerLetterData,
} from '../types/autobiography';
import { filterPublishedPhotos, filterPublishedPosts, filterPublishedTimeline, sortByOrder } from '../utils/editorial';
import { deletePhotoFromMarkBucket } from './storageUpload';
import { isSupabaseConfigured, supabase } from './supabaseClient';

function formatDbError(action: string, error: { message?: string; code?: string } | null): Error {
  if (!error) return new Error(`Failed to ${action}.`);
  const msg = error.message || 'Unknown database error';
  if (
    error.code === 'PGRST205' ||
    msg.toLowerCase().includes('schema cache') ||
    msg.toLowerCase().includes('does not exist')
  ) {
    return new Error(
      'SUPABASE_TABLES_MISSING: Your Supabase project is connected, but the database tables and "mark-photos" bucket have not been created yet. Run supabase/schema.sql in your Supabase SQL Editor.'
    );
  }
  if (msg.toLowerCase().includes('row-level security') || error.code === '42501') {
    return new Error(
      `Permission denied while trying to ${action}. Make sure you are signed in as the authorized administrator.`
    );
  }
  if (msg.toLowerCase().includes('duplicate key') || error.code === '23505') {
    return new Error(`A record with that identifier or slug already exists.`);
  }
  return new Error(`Could not ${action}: ${msg}`);
}

export async function fetchAutobiographyBundle(isAdminView = false): Promise<AutobiographyBundle> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ...DEFAULT_BUNDLE,
      posts: filterPublishedPosts(DEFAULT_BUNDLE.posts, isAdminView),
      photos: filterPublishedPhotos(DEFAULT_BUNDLE.photos, isAdminView),
      timeline: filterPublishedTimeline(DEFAULT_BUNDLE.timeline, isAdminView),
      source: 'default_seed',
    };
  }

  const [
    settingsRes,
    profileRes,
    dimensionsRes,
    timelineRes,
    thenNowRes,
    letterRes,
    postsRes,
    photosRes,
  ] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle(),
    supabase.from('profile').select('*').eq('id', 'main').maybeSingle(),
    supabase.from('self_dimensions').select('*').order('sort_order', { ascending: true }),
    isAdminView
      ? supabase.from('timeline_stages').select('*').order('sort_order', { ascending: true })
      : supabase
          .from('timeline_stages')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true }),
    supabase.from('then_and_now').select('*').eq('id', 'main').maybeSingle(),
    supabase.from('younger_letter').select('*').eq('id', 'main').maybeSingle(),
    isAdminView
      ? supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
      : supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false }),
    isAdminView
      ? supabase.from('photos').select('*').order('sort_order', { ascending: true })
      : supabase
          .from('photos')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true }),
  ]);

  const firstError =
    settingsRes.error ||
    profileRes.error ||
    dimensionsRes.error ||
    timelineRes.error ||
    thenNowRes.error ||
    letterRes.error ||
    postsRes.error ||
    photosRes.error;

  if (firstError) {
    throw formatDbError('load autobiography data from Supabase', firstError);
  }

  const dimensions: SelfDimension[] =
    dimensionsRes.data && dimensionsRes.data.length > 0
      ? sortByOrder(dimensionsRes.data as SelfDimension[])
      : DEFAULT_DIMENSIONS;

  const rawPosts = (postsRes.data ?? []) as BlogPost[];
  const rawPhotos = (photosRes.data ?? []) as PhotoItem[];
  const rawTimeline = (timelineRes.data ?? []) as TimelineStage[];

  return {
    settings: (settingsRes.data as SiteSettings | null) ?? DEFAULT_SITE_SETTINGS,
    profile: (profileRes.data as ProfileData | null) ?? DEFAULT_PROFILE,
    dimensions,
    timeline: filterPublishedTimeline(rawTimeline, isAdminView),
    thenAndNow: (thenNowRes.data as ThenAndNowData | null) ?? DEFAULT_THEN_AND_NOW,
    letter: (letterRes.data as YoungerLetterData | null) ?? DEFAULT_LETTER,
    posts: filterPublishedPosts(rawPosts, isAdminView),
    photos: filterPublishedPhotos(rawPhotos, isAdminView),
    source: 'supabase',
  };
}

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.');
  }
  return supabase;
}

export async function updateSiteSettings(payload: Partial<SiteSettings>): Promise<SiteSettings> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('site_settings')
    .upsert({ ...payload, id: 'main', updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw formatDbError('save website settings', error);
  return data as SiteSettings;
}

export async function updateProfile(payload: Partial<ProfileData>): Promise<ProfileData> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profile')
    .upsert({ ...payload, id: 'main', updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw formatDbError('save About Me profile', error);
  return data as ProfileData;
}

export async function updateSelfDimension(
  slug: string,
  payload: Partial<SelfDimension>
): Promise<SelfDimension> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('self_dimensions')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('slug', slug)
    .select()
    .single();
  if (error) throw formatDbError('save Self Dimension', error);
  return data as SelfDimension;
}

export async function saveTimelineStage(
  stage: Partial<TimelineStage> & { id?: string }
): Promise<TimelineStage> {
  const client = requireSupabase();
  const now = new Date().toISOString();
  if (stage.id && !stage.id.startsWith('stage-')) {
    const { data, error } = await client
      .from('timeline_stages')
      .update({ ...stage, updated_at: now })
      .eq('id', stage.id)
      .select()
      .single();
    if (error) throw formatDbError('update timeline stage', error);
    return data as TimelineStage;
  }
  const { id: _ignored, ...insertFields } = stage;
  const { data, error } = await client
    .from('timeline_stages')
    .insert({ ...insertFields, created_at: now, updated_at: now })
    .select()
    .single();
  if (error) throw formatDbError('create timeline stage', error);
  return data as TimelineStage;
}

export async function deleteTimelineStage(id: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('timeline_stages').delete().eq('id', id);
  if (error) throw formatDbError('delete timeline stage', error);
}

export async function persistTimelineOrder(stages: TimelineStage[]): Promise<void> {
  const client = requireSupabase();
  await Promise.all(
    stages.map((stage, idx) =>
      client
        .from('timeline_stages')
        .update({ sort_order: idx + 1, updated_at: new Date().toISOString() })
        .eq('id', stage.id)
    )
  );
}

export async function updateThenAndNow(payload: Partial<ThenAndNowData>): Promise<ThenAndNowData> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('then_and_now')
    .upsert({ ...payload, id: 'main', updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw formatDbError('save Then and Now', error);
  return data as ThenAndNowData;
}

export async function updateYoungerLetter(payload: Partial<YoungerLetterData>): Promise<YoungerLetterData> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('younger_letter')
    .upsert({ ...payload, id: 'main', updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw formatDbError('save Letter to Younger Self', error);
  return data as YoungerLetterData;
}

export async function saveBlogPost(post: Partial<BlogPost> & { id?: string }): Promise<BlogPost> {
  const client = requireSupabase();
  const now = new Date().toISOString();
  const publishedAt = post.is_published ? post.published_at || now : null;

  if (post.id && !post.id.startsWith('post-')) {
    const { data, error } = await client
      .from('blog_posts')
      .update({
        ...post,
        published_at: publishedAt,
        updated_at: now,
      })
      .eq('id', post.id)
      .select()
      .single();
    if (error) throw formatDbError('update blog post', error);
    return data as BlogPost;
  }

  const { id: _ignored, ...insertFields } = post;
  const { data, error } = await client
    .from('blog_posts')
    .insert({
      ...insertFields,
      published_at: publishedAt,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();
  if (error) throw formatDbError('create blog post', error);
  return data as BlogPost;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('blog_posts').delete().eq('id', id);
  if (error) throw formatDbError('delete blog post', error);
}

export async function createPhotoRecord(
  photo: Omit<PhotoItem, 'id' | 'created_at'>
): Promise<PhotoItem> {
  const client = requireSupabase();
  const now = new Date().toISOString();
  const { data, error } = await client
    .from('photos')
    .insert({
      ...photo,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();
  if (error) throw formatDbError('save photograph metadata', error);
  return data as PhotoItem;
}

export async function updatePhotoRecord(
  id: string,
  updates: Partial<PhotoItem>
): Promise<PhotoItem> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('photos')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw formatDbError('update photograph details', error);
  return data as PhotoItem;
}

export async function persistPhotoOrder(photos: PhotoItem[]): Promise<void> {
  const client = requireSupabase();
  await Promise.all(
    photos.map((photo, idx) =>
      client
        .from('photos')
        .update({ sort_order: idx + 1, updated_at: new Date().toISOString() })
        .eq('id', photo.id)
    )
  );
}

export async function deletePhotoRecord(photo: PhotoItem): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('photos').delete().eq('id', photo.id);
  if (error) throw formatDbError('delete photograph record', error);
  if (photo.storage_path) {
    await deletePhotoFromMarkBucket(photo.storage_path);
  }
}
