-- ============================================================================
-- "the reMARKable life of Mark" — Complete Supabase Free Schema, RLS & Storage
-- Run this entire script once in Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Administrator Whitelist Table (Zero-Trust Admin Gate)
CREATE TABLE IF NOT EXISTS public.admin_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Mark's administrator email (add or replace with your Supabase Auth email)
INSERT INTO public.admin_users (email)
VALUES ('buenomarkangelo7@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Helper function: verifies the request is authenticated AND belongs to an admin email
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.admin_users a
      WHERE lower(a.email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
    );
$$;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  USING (public.is_admin());

-- 3. Website Settings Table (Singleton id = 'main')
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  site_title TEXT NOT NULL DEFAULT 'the reMARKable life of Mark',
  tagline TEXT NOT NULL DEFAULT 'Every picture holds a memory. Every experience tells a story. Every chapter reveals a part of me.',
  hero_intro TEXT NOT NULL DEFAULT 'Welcome to my personal journey of discovering myself. Through photographs, memories, experiences, and reflections, this website tells the story of who I was, who I am, and who I am becoming.',
  intro_statement TEXT NOT NULL DEFAULT 'Before understanding the person I am today, I must first understand the experiences, memories, relationships, and moments that shaped me.',
  hero_photo_url TEXT NOT NULL DEFAULT '/src/assets/images/hero_mark_portrait_1794835743482.jpg',
  hero_photo_caption TEXT NOT NULL DEFAULT 'Quiet afternoon reflections by the study window — documenting who I am becoming.',
  course_label TEXT NOT NULL DEFAULT 'Understanding the Self · Personal Digital Autobiography',
  footer_quote TEXT NOT NULL DEFAULT 'Every chapter leaves a quiet imprint on who we are becoming.',
  footer_note TEXT NOT NULL DEFAULT 'Curated by Mark for Understanding the Self.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site_settings" ON public.site_settings;
CREATE POLICY "Public can read site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can manage site_settings" ON public.site_settings;
CREATE POLICY "Admin can manage site_settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Profile / About Me Table (Singleton id = 'main')
CREATE TABLE IF NOT EXISTS public.profile (
  id TEXT PRIMARY KEY DEFAULT 'main',
  full_name TEXT NOT NULL DEFAULT 'Mark',
  age TEXT NOT NULL DEFAULT 'College Student (Placeholder — edit in Admin)',
  education TEXT NOT NULL DEFAULT 'Undergraduate Student · Course: Understanding the Self (Placeholder)',
  hobbies TEXT NOT NULL DEFAULT 'Film photography, journaling, quiet morning walks, music, reading essays',
  personality TEXT NOT NULL DEFAULT 'Reflective, observant, curious, and quietly determined',
  values_beliefs TEXT NOT NULL DEFAULT 'Gratitude, honesty, empathy, lifelong learning, and stewardship',
  life_philosophy TEXT NOT NULL DEFAULT 'Growth rarely arrives all at once; it lives in how we notice ordinary days and learn from every season.',
  personal_goals TEXT NOT NULL DEFAULT 'To cultivate emotional clarity, finish my degree with purpose, and build meaningful relationships.',
  future_aspirations TEXT NOT NULL DEFAULT 'To contribute thoughtfully to my community while remaining grounded in who I am.',
  intro_text TEXT NOT NULL DEFAULT 'Welcome to my personal corner of memory and reflection. Use the private administrator dashboard to replace these thoughtful placeholders with your own story.',
  personal_quote TEXT NOT NULL DEFAULT 'Every picture holds a memory. Every experience tells a story. Every chapter reveals a part of me.',
  short_bio TEXT NOT NULL DEFAULT 'I am currently a college student exploring the many dimensions of identity in Understanding the Self. This digital autobiography brings together childhood keepsakes, milestones, and honest reflections on growth.',
  avatar_url TEXT NOT NULL DEFAULT '/src/assets/images/hero_mark_portrait_1794835743482.jpg',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read profile" ON public.profile;
CREATE POLICY "Public can read profile"
  ON public.profile FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can manage profile" ON public.profile;
CREATE POLICY "Admin can manage profile"
  ON public.profile FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Eight Dimensions of the Self
CREATE TABLE IF NOT EXISTS public.self_dimensions (
  slug TEXT PRIMARY KEY,
  letter_code TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  intro_description TEXT NOT NULL,
  featured_photo_url TEXT NOT NULL,
  reflection_content TEXT NOT NULL,
  prompts JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.self_dimensions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read self_dimensions" ON public.self_dimensions;
CREATE POLICY "Public can read self_dimensions"
  ON public.self_dimensions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can manage self_dimensions" ON public.self_dimensions;
CREATE POLICY "Admin can manage self_dimensions"
  ON public.self_dimensions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. Chronological Life Journey Timeline Stages
CREATE TABLE IF NOT EXISTS public.timeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INTEGER NOT NULL DEFAULT 0,
  stage_title TEXT NOT NULL,
  age_or_year TEXT NOT NULL,
  story TEXT NOT NULL,
  memories TEXT NOT NULL DEFAULT '',
  milestones TEXT NOT NULL DEFAULT '',
  lessons_learned TEXT NOT NULL DEFAULT '',
  reflection TEXT NOT NULL DEFAULT '',
  cover_photo_url TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.timeline_stages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published timeline_stages" ON public.timeline_stages;
CREATE POLICY "Public can read published timeline_stages"
  ON public.timeline_stages FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin can insert timeline_stages" ON public.timeline_stages;
CREATE POLICY "Admin can insert timeline_stages"
  ON public.timeline_stages FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can update timeline_stages" ON public.timeline_stages;
CREATE POLICY "Admin can update timeline_stages"
  ON public.timeline_stages FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can delete timeline_stages" ON public.timeline_stages;
CREATE POLICY "Admin can delete timeline_stages"
  ON public.timeline_stages FOR DELETE
  USING (public.is_admin());

-- 7. Then and Now (Singleton id = 'main')
CREATE TABLE IF NOT EXISTS public.then_and_now (
  id TEXT PRIMARY KEY DEFAULT 'main',
  younger_photo_url TEXT NOT NULL DEFAULT '/src/assets/images/childhood_golden_memory_1794835743953.jpg',
  younger_caption TEXT NOT NULL DEFAULT 'Early childhood days — learning balance, curiosity, and wonder.',
  younger_date_age TEXT NOT NULL DEFAULT 'Early Childhood · Age 6',
  present_photo_url TEXT NOT NULL DEFAULT '/src/assets/images/hero_mark_portrait_1794835743482.jpg',
  present_caption TEXT NOT NULL DEFAULT 'Present day — carrying those same questions into deeper reflection.',
  present_date_age TEXT NOT NULL DEFAULT 'College Years · Present Me',
  reflection_title TEXT NOT NULL DEFAULT 'How Much Have I Changed?',
  reflection_content TEXT NOT NULL DEFAULT 'Placeholder reflection: Write here about what has evolved between your younger years and today — your perspective, patience, resilience, and the core parts of yourself that never changed.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.then_and_now ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read then_and_now" ON public.then_and_now;
CREATE POLICY "Public can read then_and_now"
  ON public.then_and_now FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can manage then_and_now" ON public.then_and_now;
CREATE POLICY "Admin can manage then_and_now"
  ON public.then_and_now FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. Letter to Younger Self (Singleton id = 'main')
CREATE TABLE IF NOT EXISTS public.younger_letter (
  id TEXT PRIMARY KEY DEFAULT 'main',
  title TEXT NOT NULL DEFAULT 'To the Boy Still Learning Who He Will Become',
  letter_date TEXT NOT NULL DEFAULT 'November 2026',
  childhood_photo_url TEXT NOT NULL DEFAULT '/src/assets/images/childhood_golden_memory_1794835743953.jpg',
  letter_body TEXT NOT NULL DEFAULT 'Dear Younger Mark,\n\nThis space is reserved for your personal handwritten-style letter to your younger self. Open the Administrator Dashboard whenever you are ready to write your own words of reassurance, gratitude, and perspective.\n\nTell him about the quiet moments that mattered more than he realized, the mistakes that turned into teachers, and the patience it took to grow into who you are today.',
  signature TEXT NOT NULL DEFAULT 'With gratitude, Mark (Present Day)',
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.younger_letter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published younger_letter" ON public.younger_letter;
CREATE POLICY "Public can read published younger_letter"
  ON public.younger_letter FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin can manage younger_letter" ON public.younger_letter;
CREATE POLICY "Admin can manage younger_letter"
  ON public.younger_letter FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 9. Personal Blog & Reflections
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Personal Growth',
    'Life Experiences',
    'Memories',
    'Lessons Learned',
    'Self-Discovery',
    'Personal Thoughts'
  )),
  short_description TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_photo_url TEXT NOT NULL DEFAULT '',
  additional_photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published blog_posts" ON public.blog_posts;
CREATE POLICY "Public can read published blog_posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin can insert blog_posts" ON public.blog_posts;
CREATE POLICY "Admin can insert blog_posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can update blog_posts" ON public.blog_posts;
CREATE POLICY "Admin can update blog_posts"
  ON public.blog_posts FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can delete blog_posts" ON public.blog_posts;
CREATE POLICY "Admin can delete blog_posts"
  ON public.blog_posts FOR DELETE
  USING (public.is_admin());

-- 10. Photos & Metadata Table (images stored in Supabase Storage bucket "mark-photos")
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Everyday Keepsakes',
  dimension_slug TEXT DEFAULT NULL,
  timeline_stage_id UUID DEFAULT NULL REFERENCES public.timeline_stages(id) ON DELETE SET NULL,
  date_taken TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published photos" ON public.photos;
CREATE POLICY "Public can read published photos"
  ON public.photos FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin can insert photos" ON public.photos;
CREATE POLICY "Admin can insert photos"
  ON public.photos FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can update photos" ON public.photos;
CREATE POLICY "Admin can update photos"
  ON public.photos FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can delete photos" ON public.photos;
CREATE POLICY "Admin can delete photos"
  ON public.photos FOR DELETE
  USING (public.is_admin());

-- 11. Supabase Storage Bucket: "mark-photos"
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mark-photos',
  'mark-photos',
  true,
  5242880, -- 5MB per compressed image
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS Policies for "mark-photos"
DROP POLICY IF EXISTS "Public can view mark-photos" ON storage.objects;
CREATE POLICY "Public can view mark-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'mark-photos');

DROP POLICY IF EXISTS "Admin can upload to mark-photos" ON storage.objects;
CREATE POLICY "Admin can upload to mark-photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'mark-photos' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can update mark-photos" ON storage.objects;
CREATE POLICY "Admin can update mark-photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'mark-photos' AND public.is_admin())
  WITH CHECK (bucket_id = 'mark-photos' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can delete from mark-photos" ON storage.objects;
CREATE POLICY "Admin can delete from mark-photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'mark-photos' AND public.is_admin());

-- 12. Initial Seed Rows (Editable Anytime in Admin Dashboard)
INSERT INTO public.site_settings (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profile (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.then_and_now (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.younger_letter (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

INSERT INTO public.self_dimensions (slug, letter_code, sort_order, title, subtitle, intro_description, featured_photo_url, reflection_content, prompts)
VALUES
  ('material', 'A', 1, 'Material Self', 'Objects, Keepsakes & Meaning',
   'My meaningful possessions, important belongings, and the everyday objects that quietly represent my identity and memories.',
   '/src/assets/images/keepsakes_journal_flatlay_1794835744479.jpg',
   'Placeholder reflection: Reflect here on the physical belongings that hold emotional significance in your life — a handwritten notebook, a family watch, or a camera that records your memories — and why meaning matters more than price.',
   '["Meaningful possessions", "Important belongings", "Objects representing identity", "Reflections on value"]'::jsonb),
  ('physical', 'B', 2, 'Physical Self', 'Growth, Health & Presence',
   'Tracing my physical development from early childhood through elementary, teenage, high school, and college years into who I am today.',
   '/src/assets/images/hero_mark_portrait_1794835743482.jpg',
   'Placeholder reflection: Document how your relationship with your physical self has matured over time — appreciating health, growth, rest, and the ways your posture and presence reflect your lived journey.',
   '["Childhood to present growth", "Changing physical identity", "Self-care and gratitude"]'::jsonb),
  ('sexual', 'C', 3, 'Sexual Self', 'Identity, Boundaries & Respect',
   'My understanding of personal identity, healthy boundaries, mutual respect, emotional responsibility, and self-awareness.',
   '/src/assets/images/contemplative_horizon_dawn_1794835745199.jpg',
   'Placeholder reflection: Share a thoughtful, mature reflection on self-respect, setting healthy personal boundaries, responsibility in relationships, and honoring human dignity.',
   '["Personal identity", "Healthy boundaries", "Respect and responsibility", "Self-awareness"]'::jsonb),
  ('spiritual', 'D', 4, 'Spiritual Self', 'Faith, Purpose & Quiet Anchors',
   'The beliefs, faith traditions, guiding principles, and moments of quiet wonder that give my life meaning and direction.',
   '/src/assets/images/contemplative_horizon_dawn_1794835745199.jpg',
   'Placeholder reflection: Describe the core beliefs, faith, or inner principles that anchor you during uncertainty and illuminate what gives your daily life purpose.',
   '["Personal beliefs", "Faith and principles", "Meaning and purpose"]'::jsonb),
  ('political', 'E', 5, 'Political Self', 'Citizenship & Civic Responsibility',
   'My understanding of citizenship, social awareness, community participation, and my role as a responsible member of society.',
   '/src/assets/images/college_community_study_1794835745383.jpg',
   'Placeholder reflection: Reflect on what it means to be an engaged, conscientious citizen — balancing rights with civic duties and contributing positively to your school and community.',
   '["Citizenship", "Rights and responsibilities", "Community participation"]'::jsonb),
  ('digital', 'F', 6, 'Digital Self', 'Online Voice & Mindful Presence',
   'How I present myself online, communicate across screens, curate my digital footprint, and stay intentional with technology.',
   '/src/assets/images/keepsakes_journal_flatlay_1794835744479.jpg',
   'Placeholder reflection: Examine how your online identity aligns with your real-life values, how technology shapes your attention and creativity, and how you practice digital mindfulness.',
   '["Online identity", "Digital communication", "Technology in daily life"]'::jsonb),
  ('social', 'G', 7, 'Social Self', 'Family, Friendships & Belonging',
   'The family bonds, lifelong friendships, classmates, and mentors whose kindness and honesty helped shape who I am.',
   '/src/assets/images/college_community_study_1794835745383.jpg',
   'Placeholder reflection: Write about the people who walked beside you through different chapters — family around the table, classmates during late study nights, and friends who helped you grow.',
   '["Family relationships", "Friendships & classmates", "Shaping communities"]'::jsonb),
  ('emotional', 'H', 8, 'Emotional Self', 'Awareness, Patience & Maturity',
   'How I recognize, process, and express emotions — and the experiences that taught me patience, empathy, and quiet resilience.',
   '/src/assets/images/hero_mark_portrait_1794835743482.jpg',
   'Placeholder reflection: Reflect on your emotional growth — learning to name feelings honestly, respond with patience rather than impulse, and cultivate emotional maturity.',
   '["Emotional awareness", "Patience and understanding", "Maturity and expression"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Seed 6 Timeline Stages only if table is empty
INSERT INTO public.timeline_stages (sort_order, stage_title, age_or_year, story, memories, milestones, lessons_learned, reflection, cover_photo_url, is_published)
SELECT * FROM (
  VALUES
    (1, 'Early Childhood', 'Ages 1–6', 'Placeholder story: Replace with your earliest memories at home, favorite toys, and childhood wonder.', 'Sunny afternoons outdoors, learning to ride a bicycle, and family weekends.', 'First steps, first words, and starting preschool.', 'Curiosity is where every lifelong story begins.', 'Looking back, small everyday joys formed my earliest sense of safety.', '/src/assets/images/childhood_golden_memory_1794835743953.jpg', true),
    (2, 'Elementary Years', 'Ages 7–12', 'Placeholder story: Discovering classrooms, early friendships, favorite subjects, and small responsibilities.', 'Walking to school, afternoon games with classmates, and school programs.', 'Learning to read independently and participating in class activities.', 'Consistency and kindness build lasting confidence.', 'Those foundational years taught me how to share, listen, and belong.', '/src/assets/images/childhood_golden_memory_1794835743953.jpg', true),
    (3, 'Teenage Years', 'Ages 13–15', 'Placeholder story: Navigating transition, new questions about identity, and discovering personal interests.', 'Late-night conversations, discovering music and hobbies, and learning independence.', 'Stepping into greater responsibility at home and in school.', 'Growing pains are often disguised invitations to mature.', 'I began realizing that who I become depends on the habits I choose.', '/src/assets/images/keepsakes_journal_flatlay_1794835744479.jpg', true),
    (4, 'High School Life', 'Ages 16–18', 'Placeholder story: Memorable teachers, group projects, school events, and preparing for the future.', 'Reviewing with friends before exams, graduation preparations, and shared laughter.', 'Completing senior high school and clarifying academic interests.', 'True friendships endure beyond shared schedules.', 'High school taught me resilience under pressure and gratitude for mentors.', '/src/assets/images/college_community_study_1794835745383.jpg', true),
    (5, 'College Life', 'Ages 19–Present', 'Placeholder story: Stepping into university life, deeper self-reflection, and Understanding the Self.', 'Library study sessions, meaningful discussions, and balancing deadlines with personal growth.', 'Pursuing my college degree and curating this digital autobiography.', 'Understanding myself is essential before I can serve others well.', 'College has challenged me to think critically and live intentionally.', '/src/assets/images/college_community_study_1794835745383.jpg', true),
    (6, 'Present Me', 'Today', 'Placeholder story: Who I am right now — grounded in gratitude, aware of my flaws, and hopeful for what lies ahead.', 'Journaling by the window, capturing moments with my camera, and appreciating quiet growth.', 'Taking ownership of my personal values, goals, and emotional clarity.', 'Every season — joyful or difficult — leaves something valuable behind.', 'I am still a work in progress, and that is what makes becoming meaningful.', '/src/assets/images/hero_mark_portrait_1794835743482.jpg', true)
) AS v(sort_order, stage_title, age_or_year, story, memories, milestones, lessons_learned, reflection, cover_photo_url, is_published)
WHERE NOT EXISTS (SELECT 1 FROM public.timeline_stages);
