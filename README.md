# KnowMeBro 🧠

**KnowMeBro** is a shareable friendship quiz. Create a quiz about yourself, send the challenge link to friends, and compare scores on your private creator dashboard.

## Features

- Build quizzes with **5–20 questions** and four answer choices per question.
- Select the correct answer, customize question text, hints, captions, and difficulty.
- Choose from a curated real-photo library, use photo shortcuts, or upload compressed images.
- Preview the quiz as a friend before publishing.
- Share challenge links that work across devices.
- Resume an unfinished quiz on the same browser.
- Create an account, log in, reset a forgotten password, and log out securely through Supabase Auth.
- Keep up to 50 creator quizzes linked to your account and restore creator access when you log in on another device.
- Review answers, confidence choices, score analytics, and the leaderboard.
- Export results as CSV and save a leaderboard image.
- Light and dark themes, keyboard navigation, responsive layouts, and image fallbacks.

## Tech stack

- React 19
- Vite 7
- Supabase Postgres and RPC functions
- Vercel and Render static hosting

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

The frontend uses a Supabase publishable key, which is intended for browser use. Database tables have Row Level Security enabled; app data operations go through database RPC functions.

## Database migrations

Database migration history is tracked in `supabase/migrations/`. The public quiz RPC intentionally returns question text, answer options, photos, hints, captions, difficulty, and vibe—but never the correct answer. The creator-only results RPC checks the creator token before returning private results.

## Deployments

- Production: https://knowmebro.vercel.app
- Alternate static host: https://knowmebro.onrender.com
- Source: https://github.com/ayushydv1805/KnowMeBro

## Account authentication setup

The account screens use Supabase Auth. Before enabling sign-up and password recovery in production, configure the Supabase Auth **Site URL** and **Redirect URLs** to allow each deployed origin you use, including `https://knowmebro.vercel.app`, `https://knowmebro.onrender.com`, and your local development origin such as `http://localhost:5173`. Supabase email confirmation must be enabled/configured as desired. The app sends confirmation and recovery links back to the current origin so the flow can work on either host. Do not expose a Supabase `service_role` key in the frontend.

When signed in, new quizzes are linked to the account's user metadata so creator access can be restored on another device. Quizzes created before login remain on the browser where their creator token was stored unless you recreate them while signed in.

GitHub Actions runs `npm run build` on pushes and pull requests to `main`.


## Desktop downloads (Windows)

KnowMeBro is also packaged as a Windows desktop app. The [Windows build workflow](https://github.com/ayushydv1805/KnowMeBro/actions/workflows/windows-desktop.yml) produces a Setup installer and a portable EXE. Tagged releases publish the EXEs on the [GitHub Releases page](https://github.com/ayushydv1805/KnowMeBro/releases). See [Windows installation instructions](WINDOWS_INSTALL.md). The desktop app requires internet access and uses the same hosted app and account backend.


## Official downloads

Use the simple [KnowMeBro download page](https://knowmebro.onrender.com/download/) for Android APK and Windows PC downloads. After the download workflow completes on `main`, the official latest-release links are stable:

- Android APK: https://github.com/ayushydv1805/KnowMeBro/releases/latest/download/KnowMeBro.apk
- Windows installer: https://github.com/ayushydv1805/KnowMeBro/releases/latest/download/KnowMeBro-Setup.exe
- Windows portable: https://github.com/ayushydv1805/KnowMeBro/releases/latest/download/KnowMeBro-Portable.exe

Search engines may take time to index the download page; Google search appearance is not guaranteed immediately.
