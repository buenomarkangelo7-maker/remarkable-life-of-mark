# Zero-Cost Deployment Guide
## "the reMARKable life of Mark" — Supabase Free + GitHub Pages / Firebase Hosting Spark ($0.00/month)

This application is built as a **100% static production frontend** that deploys for **$0.00/month** on **GitHub Pages** (via the included `.github/workflows/deploy-github-pages.yml` workflow) or **Firebase Hosting (Spark Free Plan)**, backed by **Supabase (Free Plan)** for Authentication, PostgreSQL Database (with Row Level Security), and Storage (`mark-photos` bucket).

---

### Option 1: Free Hosting Only on GitHub Pages (Works from Phone or Laptop!)

1. **Export / Push This Project to GitHub**
   - In Google AI Studio's top toolbar, click **GitHub** (push to a new repository) or **Download** (`.zip`), extract it, and push all files (including `.github/workflows/deploy-github-pages.yml`) to a **Public** GitHub repository (for example `remarkable-mark`).

2. **Add Your Public Supabase Keys to GitHub Repository Secrets**
   - Open your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
   - Add these two secrets (found in **Supabase Dashboard → Project Settings → API**):
     - `VITE_SUPABASE_URL` → your Supabase Project URL
     - `VITE_SUPABASE_ANON_KEY` → your Supabase **Publishable / anon** key *(never use `service_role`)*

3. **Turn On GitHub Pages**
   - In your GitHub repository, go to **Settings** → **Pages**.
   - Under **Build and deployment → Source**, select **GitHub Actions**.

4. **Publish Your Site**
   - Go to the **Actions** tab in your GitHub repository → click **Deploy to GitHub Pages** → click **Run workflow** (or push any commit to `main`).
   - Within ~1–2 minutes, GitHub will show your live URL (e.g. `https://YOUR_USERNAME.github.io/remarkable-mark/`).

5. **Allow Your GitHub Pages URL in Supabase Auth**
   - Open **Supabase Dashboard → Authentication → URL Configuration**.
   - Set **Site URL** to your live GitHub Pages URL and add it under **Redirect URLs**.

---

### Part 1: Set Up Supabase Free (Can be done on Laptop or Phone Browser)

1. **Create a Free Project**
   - Go to [supabase.com](https://supabase.com) and sign in.
   - Click **New project**, name it `remarkable-mark`, choose a strong database password, and select the **Free** plan ($0/month).

2. **Create Tables, RLS Policies, and the `mark-photos` Storage Bucket**
   - In your Supabase project dashboard, open **SQL Editor** -> **New query**.
   - Open `supabase/schema.sql` from this repository, copy the entire script, paste it into the SQL Editor, and click **Run**.
   - This automatically creates:
     - All database tables (`site_settings`, `profile`, `self_dimensions`, `timeline_stages`, `then_and_now`, `younger_letter`, `blog_posts`, `photos`, `admin_users`)
     - Strict **Row Level Security (RLS)** policies so public visitors can only read published content and only your authenticated admin can create, edit, or delete
     - The **`mark-photos`** Storage bucket with 5MB compressed image validation and admin-only upload/delete policies

3. **Disable Public Registration & Create Your Private Administrator Account**
   - Go to **Authentication** -> **Providers** -> **Email** (or **Authentication -> Sign In / Providers**):
     - Turn **OFF** `"Allow new users to sign up"` (or disable public signups in Auth settings) so visitors can never register an account.
   - Go to **Authentication** -> **Users** -> **Add user** -> **Create new user**:
     - Enter your administrator email (for example `buenomarkangelo7@gmail.com`) and a strong password, and check **Auto Confirm User**.
   - If you used a different email than `buenomarkangelo7@gmail.com`, also run in **SQL Editor**:
     ```sql
     INSERT INTO public.admin_users (email)
     VALUES ('your-admin-email@example.com')
     ON CONFLICT (email) DO NOTHING;
     ```

4. **Copy Your Public Frontend Keys**
   - Go to **Project Settings** -> **API**.
   - Copy:
     - **Project URL** -> `VITE_SUPABASE_URL`
     - **anon / public** key -> `VITE_SUPABASE_ANON_KEY`
   - **NEVER** copy or paste the `service_role` secret key into `.env` or frontend code.

---

### Part 2: Configure Environment Variables Locally

Create a `.env` file in the project root (do not commit `.env` to Git):

```env
VITE_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY"
```

Test locally:
```bash
npm install
npm run build
```

---

### Part 3: Alternative — Deploy to Firebase Hosting (Spark Free Plan — No Credit Card)

1. **Create a Firebase Project (Spark Plan)**
   - Visit [console.firebase.google.com](https://console.firebase.google.com) -> **Add project** -> keep the default **Spark (Free)** plan.
   - Do **not** upgrade to Blaze or enable Firebase Storage.

2. **Install Firebase CLI & Log In**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

3. **Link Your Firebase Project ID**
   - Edit `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` with your Firebase Project ID (from Firebase Console -> Project Settings).

4. **Build & Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```
   - Firebase will immediately print your live public HTTPS URL (e.g., `https://your-project-id.web.app`).
   - Share that URL with your professor and classmates!

---

### Part 4: Updating Content Anytime (Mobile-Friendly!)

- Open `https://your-project-id.web.app/admin` on your **phone or laptop**.
- Sign in with your private Supabase administrator email and password.
- Upload compressed photos directly from your phone camera/gallery, write reflections or blog drafts, and click **Publish** when ready to make them visible on the public site.
- No re-deployment is needed when you add photos, edit your About Me, or publish blog posts!
