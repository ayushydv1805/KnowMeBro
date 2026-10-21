# KnowMeBro 🧠

**KnowMeBro** is a shareable friendship quiz. Create a quiz about yourself, send the challenge link to friends, and compare scores on your private creator dashboard.

## Features

- Build quizzes with **5–20 questions** and four answer choices per question.
- Select the correct answer, customize question text, hints, captions, and difficulty.
- Choose from a curated real-photo library, use photo shortcuts, or upload compressed images.
- Preview the quiz as a friend before publishing.
- Share challenge links that work across devices.
- Resume an unfinished quiz on the same browser.
- Review answers, confidence choices, score analytics, and the leaderboard.
- Unlock creator achievements for milestones such as the first player, a growing crowd, a perfect score, and high average scores.
- Download a shareable “Friendship Wrapped” recap image with attempts, average score, perfect scores, and top friend.
- Export results as CSV and save a leaderboard image.
- Light and dark themes, keyboard navigation, responsive layouts, and image fallbacks.
- Visible keyboard focus, skip-to-content navigation, screen-reader labels and live error/status announcements.
- Dialog keyboard dismissal and focus restoration, plus reduced-motion support for motion-sensitive users.

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

Run the regression tests:

```bash
npm test
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

GitHub Actions runs regression tests, a production build, npm dependency auditing, and CodeQL static analysis on pull requests and pushes to `main`, with a scheduled weekly run. Dependabot proposes weekly npm and GitHub Actions updates.

See [Security Policy](./SECURITY.md) to report a vulnerability and the [Production Readiness Checklist](./docs/PRODUCTION_READINESS.md) for the release gates and live-service checks.
