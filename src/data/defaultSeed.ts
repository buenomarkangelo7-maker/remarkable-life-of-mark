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

export const IMG_HERO_PORTRAIT = '/src/assets/images/hero_mark_portrait_1794835743482.jpg';
export const IMG_CHILDHOOD_BICYCLE = '/src/assets/images/childhood_golden_memory_1794835743953.jpg';
export const IMG_KEEPSAKES_FLATLAY = '/src/assets/images/keepsakes_journal_flatlay_1794835744479.jpg';
export const IMG_HORIZON_DAWN = '/src/assets/images/contemplative_horizon_dawn_1794835745199.jpg';
export const IMG_COLLEGE_STUDY = '/src/assets/images/college_community_study_1794835745383.jpg';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'main',
  site_title: 'the reMARKable life of Mark',
  tagline: 'Every picture holds a memory. Every experience tells a story. Every chapter reveals a part of me.',
  hero_intro:
    'Welcome to my personal journey of discovering myself. Through photographs, memories, experiences, and reflections, this website tells the story of who I was, who I am, and who I am becoming.',
  intro_statement:
    'Before understanding the person I am today, I must first understand the experiences, memories, relationships, and moments that shaped me.',
  hero_photo_url: IMG_HERO_PORTRAIT,
  hero_photo_caption: 'Afternoon quiet by the study window — reflecting on every chapter that brought me here.',
  course_label: 'Understanding the Self · A Personal Digital Autobiography',
  footer_quote: 'Who I was, what shaped me, who I am today, and who I am still becoming.',
  footer_note: 'Curated personally by Mark for Understanding the Self.',
};

export const DEFAULT_PROFILE: ProfileData = {
  id: 'main',
  full_name: 'Mark',
  age: '20 (Placeholder — update in Admin Dashboard)',
  education: 'College Undergraduate · Understanding the Self (Placeholder)',
  hobbies: 'Film photography, journaling, quiet morning walks, music, reading personal essays',
  personality: 'Reflective, observant, gentle, curious, and quietly persistent',
  values_beliefs: 'Honesty, gratitude, empathy, lifelong curiosity, and respect for every season of growth',
  life_philosophy:
    'We rarely become ourselves in a single defining moment; we are shaped slowly by the habits we keep, the people we love, and the courage to reflect honestly.',
  personal_goals:
    'To cultivate steady emotional maturity, complete my college studies with integrity, and honor my commitments with patience.',
  future_aspirations:
    'To build a meaningful career grounded in service, keep documenting ordinary life with gratitude, and remain true to my core values.',
  intro_text:
    'This page introduces who I am today — a collection of my background, guiding beliefs, quiet habits, and the aspirations I am growing toward.',
  personal_quote:
    'Every picture holds a memory. Every experience tells a story. Every chapter reveals a part of me.',
  short_bio:
    'I am a college student assembling this digital autobiography for Understanding the Self. Each section here serves as a living canvas where I can preserve photographs, document turning points, and reflect openly on my personal development from childhood to the present.',
  avatar_url: IMG_HERO_PORTRAIT,
};

export const DEFAULT_DIMENSIONS: SelfDimension[] = [
  {
    slug: 'material',
    letter_code: 'A',
    sort_order: 1,
    title: 'Material Self',
    subtitle: 'Objects, Keepsakes & Meaning',
    intro_description:
      'My meaningful possessions, important belongings, and the everyday objects that quietly carry my personal history and identity.',
    featured_photo_url: IMG_KEEPSAKES_FLATLAY,
    reflection_content:
      'Placeholder reflection: Our possessions often reveal what we care about preserving. Whether it is a well-worn notebook filled with late-night notes, a mechanical watch passed down with care, or a camera that records fleeting afternoons, the value of these belongings lies not in price tags, but in the memories and intentions attached to them.\n\nUse the private Administrator Dashboard to write your own reflection on the objects and keepsakes that symbolize your identity.',
    prompts: [
      'Meaningful possessions & keepsakes',
      'Important belongings that anchor memories',
      'Objects representing personal identity',
      'Reflections on value beyond price',
    ],
  },
  {
    slug: 'physical',
    letter_code: 'B',
    sort_order: 2,
    title: 'Physical Self',
    subtitle: 'Growth, Presence & Embodiment',
    intro_description:
      'My physical development from early childhood, elementary days, teenage years, and high school through to my present self.',
    featured_photo_url: IMG_HERO_PORTRAIT,
    reflection_content:
      'Placeholder reflection: Tracing photographs from childhood through high school and college reveals far more than changes in height or posture. It records years of growth, energy, exhaustion, recovery, and learning to care respectfully for the body that carries us through every experience.\n\nReplace this placeholder in the Administrator Dashboard with your personal reflections on physical growth and identity.',
    prompts: [
      'Childhood & elementary development',
      'Teenage & high school milestones',
      'Present-day habits and self-care',
      'Reflections on changing identity',
    ],
  },
  {
    slug: 'sexual',
    letter_code: 'C',
    sort_order: 3,
    title: 'Sexual Self',
    subtitle: 'Identity, Boundaries & Respect',
    intro_description:
      'My understanding of personal identity, healthy boundaries, mutual respect, emotional maturity, and personal responsibility.',
    featured_photo_url: IMG_HORIZON_DAWN,
    reflection_content:
      'Placeholder reflection: Understanding this dimension of the self means approaching identity with honesty, dignity, and respect for both oneself and others. Healthy boundaries, clear communication, and responsibility form the foundation of mature relationships.\n\nEdit this placeholder in the Administrator Dashboard to express your personal perspective and lessons learned.',
    prompts: [
      'Personal identity & self-respect',
      'Setting and honoring boundaries',
      'Responsibility & dignity in relationships',
      'Self-awareness and maturity',
    ],
  },
  {
    slug: 'spiritual',
    letter_code: 'D',
    sort_order: 4,
    title: 'Spiritual Self',
    subtitle: 'Faith, Principles & Purpose',
    intro_description:
      'My personal beliefs, faith, guiding moral principles, and the quiet experiences that give my life deeper meaning and direction.',
    featured_photo_url: IMG_HORIZON_DAWN,
    reflection_content:
      'Placeholder reflection: In moments of silence — watching early morning mist settle over the hills or sitting quietly after a demanding week — I am reminded that life is bigger than daily schedules. Faith, gratitude, and enduring principles act as an inner compass when decisions feel uncertain.\n\nUpdate this section in the Administrator Dashboard with the beliefs and experiences that anchor your spirit.',
    prompts: [
      'Personal faith & core beliefs',
      'Values guiding daily decisions',
      'Experiences that deepened meaning',
      'Sources of hope and purpose',
    ],
  },
  {
    slug: 'political',
    letter_code: 'E',
    sort_order: 5,
    title: 'Political Self',
    subtitle: 'Citizenship & Civic Responsibility',
    intro_description:
      'My understanding of citizenship, social responsibilities, community participation, and my role as a conscientious member of society.',
    featured_photo_url: IMG_COLLEGE_STUDY,
    reflection_content:
      'Placeholder reflection: Being part of a community means recognizing that our choices extend beyond our own doorstep. Understanding rights alongside civic responsibilities encourages empathy, informed participation, and service to neighbors and classmates alike.\n\nCustomize this placeholder in the Administrator Dashboard with your reflections on citizenship and social engagement.',
    prompts: [
      'Understanding rights & citizenship',
      'Social and civic responsibilities',
      'Community and school participation',
      'Contributing thoughtfully to society',
    ],
  },
  {
    slug: 'digital',
    letter_code: 'F',
    sort_order: 6,
    title: 'Digital Self',
    subtitle: 'Online Identity & Intentional Tech',
    intro_description:
      'My online presence, how I express myself across digital spaces, and how technology influences my communication and daily rhythm.',
    featured_photo_url: IMG_KEEPSAKES_FLATLAY,
    reflection_content:
      'Placeholder reflection: Much of modern connection happens through screens, yet building a digital autobiography reminds me that technology works best when it preserves genuine human stories rather than replacing them. Staying mindful of how I speak and share online keeps my digital self aligned with who I am offline.\n\nUpdate this text in the Administrator Dashboard with your personal digital habits and reflections.',
    prompts: [
      'Authentic online identity',
      'Mindful social media presence',
      'Digital communication & empathy',
      'Balancing screens with presence',
    ],
  },
  {
    slug: 'social',
    letter_code: 'G',
    sort_order: 7,
    title: 'Social Self',
    subtitle: 'Family, Friendships & Belonging',
    intro_description:
      'Relationships with family, lifelong friendships, classmates, and the meaningful people whose presence shaped my character.',
    featured_photo_url: IMG_COLLEGE_STUDY,
    reflection_content:
      'Placeholder reflection: Nobody grows into themselves alone. Around family dinner tables, in crowded hallways, and across quiet library study tables, the people in our lives teach us patience, loyalty, humor, and how to show up for one another.\n\nAdd your own stories and captioned photographs of family and friends through the Administrator Dashboard.',
    prompts: [
      'Family roots and traditions',
      'Close friendships & shared laughter',
      'Classmates, teachers, and mentors',
      'Experiences that shaped social identity',
    ],
  },
  {
    slug: 'emotional',
    letter_code: 'H',
    sort_order: 8,
    title: 'Emotional Self',
    subtitle: 'Awareness, Patience & Maturity',
    intro_description:
      'My emotional development, self-awareness, how I navigate difficult feelings, and the experiences that cultivated patience and maturity.',
    featured_photo_url: IMG_HERO_PORTRAIT,
    reflection_content:
      'Placeholder reflection: Emotional maturity has never meant hiding what I feel; it has meant learning to listen to my emotions with honesty before reacting. Challenges, disappointments, and quiet triumphs alike have taught me greater gentleness toward myself and others.\n\nEdit this reflection in the Administrator Dashboard whenever you are ready to share your personal journey.',
    prompts: [
      'Emotional awareness & honesty',
      'Healthy ways of expressing feelings',
      'Developing patience under pressure',
      'Lessons in empathy and maturity',
    ],
  },
];

export const DEFAULT_TIMELINE: TimelineStage[] = [
  {
    id: 'stage-1',
    sort_order: 1,
    stage_title: 'Early Childhood',
    age_or_year: 'Ages 1–6',
    story:
      'Placeholder story: My earliest years were filled with simple discoveries — sunlit afternoons outdoors, curiosity about how things worked, and the comforting rhythm of home.',
    memories: 'Learning to ride a small red bicycle beneath shade trees, family weekends, and bedtime stories.',
    milestones: 'First words, first friendships in the neighborhood, and stepping into preschool.',
    lessons_learned: 'Wonder and curiosity are the earliest roots of self-discovery.',
    reflection: 'Even before I could write my story, the warmth of those early days quietly shaped my sense of belonging.',
    cover_photo_url: IMG_CHILDHOOD_BICYCLE,
    is_published: true,
  },
  {
    id: 'stage-2',
    sort_order: 2,
    stage_title: 'Elementary Years',
    age_or_year: 'Ages 7–12',
    story:
      'Placeholder story: Elementary school opened a wider world of classrooms, notebooks, shared lunches, and discovering the joy of learning alongside classmates.',
    memories: 'Handwritten school projects, afternoon games after the final bell, and cheering during school events.',
    milestones: 'Completing elementary school and discovering early creative interests.',
    lessons_learned: 'Small daily effort and kindness toward classmates go a long way.',
    reflection: 'Those years taught me how to listen, cooperate, and take pride in honest work.',
    cover_photo_url: IMG_CHILDHOOD_BICYCLE,
    is_published: true,
  },
  {
    id: 'stage-3',
    sort_order: 3,
    stage_title: 'Teenage Years',
    age_or_year: 'Ages 13–15',
    story:
      'Placeholder story: A season of transition — asking bigger questions about who I was, testing new interests, and learning to navigate self-doubt with patience.',
    memories: 'Keeping my first personal journal, long playlists, and quiet talks with trusted friends.',
    milestones: 'Taking on greater responsibility at home and finding my personal voice.',
    lessons_learned: 'Discomfort is often part of outgrowing an older version of yourself.',
    reflection: 'Looking back, I appreciate how necessary those uncertain years were for building resilience.',
    cover_photo_url: IMG_KEEPSAKES_FLATLAY,
    is_published: true,
  },
  {
    id: 'stage-4',
    sort_order: 4,
    stage_title: 'High School Life',
    age_or_year: 'Ages 16–18',
    story:
      'Placeholder story: High school brought unforgettable group collaborations, demanding deadlines, inspiring teachers, and friendships that carried me forward.',
    memories: 'Reviewing together before exams, campus afternoons, and celebrating graduation milestones.',
    milestones: 'Graduating high school and clarifying my academic direction for college.',
    lessons_learned: 'Steady discipline and supportive peers make difficult goals achievable.',
    reflection: 'High school taught me gratitude for mentors who believed in my potential.',
    cover_photo_url: IMG_COLLEGE_STUDY,
    is_published: true,
  },
  {
    id: 'stage-5',
    sort_order: 5,
    stage_title: 'College Life',
    age_or_year: 'Ages 19–Present',
    story:
      'Placeholder story: Entering college introduced greater independence, critical thinking, and courses like Understanding the Self that invited deeper introspection.',
    memories: 'Library study sessions with friends, morning commutes, and thoughtful classroom dialogues.',
    milestones: 'Balancing academic growth with personal reflection and building this autobiography.',
    lessons_learned: 'Self-awareness is not a side project — it shapes every decision we make.',
    reflection: 'College continues to stretch my perspective and refine my purpose.',
    cover_photo_url: IMG_COLLEGE_STUDY,
    is_published: true,
  },
  {
    id: 'stage-6',
    sort_order: 6,
    stage_title: 'Present Me',
    age_or_year: 'Today',
    story:
      'Placeholder story: Today I stand grateful for every chapter behind me — still learning, still listening, and intentional about who I am becoming.',
    memories: 'Writing reflections by the study window, preserving photographs, and savoring ordinary moments.',
    milestones: 'Owning my values, emotional clarity, and future goals with quiet confidence.',
    lessons_learned: 'Every season leaves something meaningful behind when we take time to reflect.',
    reflection: 'I am not finished yet — and that openness is where growth lives.',
    cover_photo_url: IMG_HERO_PORTRAIT,
    is_published: true,
  },
];

export const DEFAULT_THEN_AND_NOW: ThenAndNowData = {
  id: 'main',
  younger_photo_url: IMG_CHILDHOOD_BICYCLE,
  younger_caption: 'Placeholder younger memory: Endless curiosity, sunlit paths, and learning how to keep my balance.',
  younger_date_age: 'Early Childhood · Around Age 6',
  present_photo_url: IMG_HERO_PORTRAIT,
  present_caption: 'Placeholder present portrait: Still curious, now writing down the stories behind every mile.',
  present_date_age: 'College Years · Present Me',
  reflection_title: 'How Much Have I Changed?',
  reflection_content:
    'Placeholder reflection: Placing my younger self beside who I am today reveals a quiet continuity beneath all the visible change. The world feels more complex now, responsibilities are heavier, and my perspectives have deepened — yet the curiosity and hope that animated my childhood still sit at the center of who I am.\n\nUse the private Administrator Dashboard to upload your own childhood and present-day photographs and write your personal reflection on how time has shaped you.',
};

export const DEFAULT_LETTER: YoungerLetterData = {
  id: 'main',
  title: 'To the Boy Still Learning Who He Will Become',
  letter_date: 'November 2026',
  childhood_photo_url: IMG_CHILDHOOD_BICYCLE,
  letter_body:
    'Dear Younger Mark,\n\nIf you could look ahead for just a moment, I hope you would feel calm rather than rushed. So many of the small worries that feel overwhelming right now will eventually soften into lessons that teach you patience, humility, and gratitude.\n\nKeep paying attention to ordinary days. Hold close the people who genuinely care for you, forgive yourself when you stumble, and never lose the quiet curiosity that makes you ask why things matter.\n\nThis letter is a starting placeholder — sign in to your private Administrator Dashboard anytime to write your own heartfelt words to your younger self.',
  signature: 'With gratitude and patience,\nMark (Present Day)',
  is_published: true,
};

export const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'why-preserving-ordinary-memories-matters',
    title: 'Why Preserving Ordinary Memories Matters',
    category: 'Self-Discovery',
    short_description:
      'Placeholder essay: Exploring why small everyday photographs and quiet journal entries often reveal more about our identity than major milestones alone.',
    content:
      'When we begin documenting our lives for Understanding the Self, it is tempting to search only for dramatic turning points — graduations, awards, or big announcements. Yet when we look back through old photo albums, the moments that move us most are often quiet, unscripted afternoons.\n\nA bicycle parked under a tree, a well-used notebook beside a window, or friends laughing around a library table capture who we genuinely were when nobody was staging a speech.\n\nUse the Administrator Dashboard to edit this placeholder essay, add your own reflections, or publish new stories across any category.',
    featured_photo_url: IMG_KEEPSAKES_FLATLAY,
    additional_photos: [
      {
        url: IMG_CHILDHOOD_BICYCLE,
        caption: 'Childhood afternoons taught me how to notice quiet beauty.',
      },
    ],
    is_published: true,
    published_at: '2026-11-10T09:00:00Z',
    created_at: '2026-11-10T09:00:00Z',
    updated_at: '2026-11-10T09:00:00Z',
  },
  {
    id: 'post-2',
    slug: 'growing-through-shared-tables-and-late-study-nights',
    title: 'Growing Through Shared Tables and Late Study Nights',
    category: 'Life Experiences',
    short_description:
      'Placeholder essay: Reflecting on how college classmates, honest conversations, and shared perseverance shape our social and emotional selves.',
    content:
      'College rarely transforms us in isolation. More often, growth happens around shared tables — trading notes before an exam, encouraging a friend who feels discouraged, and discovering that vulnerability builds deeper community than pretending to have every answer.\n\nIn this reflection space, document the friendships, mentors, and everyday campus experiences that helped you understand your social and emotional self.',
    featured_photo_url: IMG_COLLEGE_STUDY,
    additional_photos: [],
    is_published: true,
    published_at: '2026-11-05T14:30:00Z',
    created_at: '2026-11-05T14:30:00Z',
    updated_at: '2026-11-05T14:30:00Z',
  },
  {
    id: 'post-3',
    slug: 'finding-stillness-in-seasons-of-change',
    title: 'Finding Stillness in Seasons of Change',
    category: 'Personal Growth',
    short_description:
      'Placeholder essay: Notes on slowing down, listening inward, and appreciating the person you are quietly becoming.',
    content:
      'Change can feel noisy when we measure ourselves only by outward speed. Yet stepping back to watch morning light cross quiet hills reminds us that meaningful growth takes time.\n\nReplace this entry from your private Administrator Dashboard whenever you are ready to share your personal lessons learned.',
    featured_photo_url: IMG_HORIZON_DAWN,
    additional_photos: [],
    is_published: true,
    published_at: '2026-10-28T07:15:00Z',
    created_at: '2026-10-28T07:15:00Z',
    updated_at: '2026-10-28T07:15:00Z',
  },
];

export const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: 'photo-1',
    url: IMG_HERO_PORTRAIT,
    storage_path: '',
    title: 'By the Study Window',
    caption: 'Quiet reflection with a notebook in warm afternoon light.',
    description: 'Placeholder photograph representing the Present Me and Emotional Self chapters.',
    category: 'Everyday Keepsakes',
    dimension_slug: 'physical',
    timeline_stage_id: 'stage-6',
    date_taken: '2026',
    location: 'Study Room',
    sort_order: 1,
    is_published: true,
    created_at: '2026-11-01T10:00:00Z',
  },
  {
    id: 'photo-2',
    url: IMG_CHILDHOOD_BICYCLE,
    storage_path: '',
    title: 'Golden Afternoon Bicycle',
    caption: 'Early childhood days under the acacia tree.',
    description: 'Placeholder childhood keepsake evoking Early Childhood and Then & Now memories.',
    category: 'Childhood',
    dimension_slug: 'physical',
    timeline_stage_id: 'stage-1',
    date_taken: 'Age 6',
    location: 'Neighborhood Path',
    sort_order: 2,
    is_published: true,
    created_at: '2026-11-02T10:00:00Z',
  },
  {
    id: 'photo-3',
    url: IMG_KEEPSAKES_FLATLAY,
    storage_path: '',
    title: 'Journal, Camera & Timepiece',
    caption: 'Everyday objects that preserve my stories and thoughts.',
    description: 'Placeholder keepsake photo for Material Self and Digital Self reflections.',
    category: 'Self Dimensions',
    dimension_slug: 'material',
    timeline_stage_id: 'stage-3',
    date_taken: '2025',
    location: 'Desk Archive',
    sort_order: 3,
    is_published: true,
    created_at: '2026-11-03T10:00:00Z',
  },
  {
    id: 'photo-4',
    url: IMG_COLLEGE_STUDY,
    storage_path: '',
    title: 'Shared Library Table',
    caption: 'Learning alongside friends and classmates during college.',
    description: 'Placeholder photograph representing Social Self, Political Self, and College Life.',
    category: 'School & Campus',
    dimension_slug: 'social',
    timeline_stage_id: 'stage-5',
    date_taken: '2026',
    location: 'University Library',
    sort_order: 4,
    is_published: true,
    created_at: '2026-11-04T10:00:00Z',
  },
  {
    id: 'photo-5',
    url: IMG_HORIZON_DAWN,
    storage_path: '',
    title: 'Dawn Over Quiet Hills',
    caption: 'Stillness at sunrise — space to reflect on purpose and peace.',
    description: 'Placeholder landscape representing Spiritual Self and Emotional Self.',
    category: 'Milestones',
    dimension_slug: 'spiritual',
    timeline_stage_id: null,
    date_taken: '2026',
    location: 'Overlook Ridge',
    sort_order: 5,
    is_published: true,
    created_at: '2026-11-05T10:00:00Z',
  },
];

export const DEFAULT_BUNDLE: AutobiographyBundle = {
  settings: DEFAULT_SITE_SETTINGS,
  profile: DEFAULT_PROFILE,
  dimensions: DEFAULT_DIMENSIONS,
  timeline: DEFAULT_TIMELINE,
  thenAndNow: DEFAULT_THEN_AND_NOW,
  letter: DEFAULT_LETTER,
  posts: DEFAULT_POSTS,
  photos: DEFAULT_PHOTOS,
  source: 'default_seed',
};
