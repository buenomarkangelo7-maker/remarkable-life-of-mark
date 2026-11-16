export type BlogCategory =
  | 'Personal Growth'
  | 'Life Experiences'
  | 'Memories'
  | 'Lessons Learned'
  | 'Self-Discovery'
  | 'Personal Thoughts';

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Personal Growth',
  'Life Experiences',
  'Memories',
  'Lessons Learned',
  'Self-Discovery',
  'Personal Thoughts',
];

export const PHOTO_CATEGORIES: string[] = [
  'Childhood',
  'Family & Friends',
  'School & Campus',
  'Milestones',
  'Everyday Keepsakes',
  'Self Dimensions',
];

export type SelfDimensionSlug =
  | 'material'
  | 'physical'
  | 'sexual'
  | 'spiritual'
  | 'political'
  | 'digital'
  | 'social'
  | 'emotional';

export interface SiteSettings {
  id: string;
  site_title: string;
  tagline: string;
  hero_intro: string;
  intro_statement: string;
  hero_photo_url: string;
  hero_photo_caption: string;
  course_label: string;
  footer_quote: string;
  footer_note: string;
  updated_at?: string;
}

export interface ProfileData {
  id: string;
  full_name: string;
  age: string;
  education: string;
  hobbies: string;
  personality: string;
  values_beliefs: string;
  life_philosophy: string;
  personal_goals: string;
  future_aspirations: string;
  intro_text: string;
  personal_quote: string;
  short_bio: string;
  avatar_url: string;
  updated_at?: string;
}

export interface SelfDimension {
  slug: SelfDimensionSlug;
  letter_code: string;
  sort_order: number;
  title: string;
  subtitle: string;
  intro_description: string;
  featured_photo_url: string;
  reflection_content: string;
  prompts: string[];
  updated_at?: string;
}

export interface TimelineStage {
  id: string;
  sort_order: number;
  stage_title: string;
  age_or_year: string;
  story: string;
  memories: string;
  milestones: string;
  lessons_learned: string;
  reflection: string;
  cover_photo_url: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ThenAndNowData {
  id: string;
  younger_photo_url: string;
  younger_caption: string;
  younger_date_age: string;
  present_photo_url: string;
  present_caption: string;
  present_date_age: string;
  reflection_title: string;
  reflection_content: string;
  updated_at?: string;
}

export interface YoungerLetterData {
  id: string;
  title: string;
  letter_date: string;
  childhood_photo_url: string;
  letter_body: string;
  signature: string;
  is_published: boolean;
  updated_at?: string;
}

export interface AdditionalBlogPhoto {
  url: string;
  caption: string;
  storage_path?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
  short_description: string;
  content: string;
  featured_photo_url: string;
  additional_photos: AdditionalBlogPhoto[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  storage_path: string;
  title: string;
  caption: string;
  description: string;
  category: string;
  dimension_slug: SelfDimensionSlug | null;
  timeline_stage_id: string | null;
  date_taken: string;
  location: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface AutobiographyBundle {
  settings: SiteSettings;
  profile: ProfileData;
  dimensions: SelfDimension[];
  timeline: TimelineStage[];
  thenAndNow: ThenAndNowData;
  letter: YoungerLetterData;
  posts: BlogPost[];
  photos: PhotoItem[];
  source: 'supabase' | 'default_seed';
}

export interface AdminOverviewStats {
  totalPhotos: number;
  publishedPhotos: number;
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  timelineStages: number;
}
