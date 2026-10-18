# EduVerse AI

A personalized, AI-powered 3D educational universe. Built with React, Three.js
(react-three-fiber), Framer Motion, Tailwind CSS and Zustand on the frontend,
with a small Express proxy backing the Gemini-powered AI Tutor.

## Structure

- `client/` — Vite + React + TypeScript frontend (onboarding, dashboard, 3D
  subject worlds, Sorting Arena, Graph Laboratory, AI Tutor, progress &
  gamification).
- `server/` — Express server used for **local development**. It proxies chat
  requests to the Gemini API so the API key never reaches the browser.
  Configure it via `server/.env` (`GEMINI_API_KEY`, `PORT`).
- `netlify/functions/` — the same Gemini proxy, packaged as a Netlify
  serverless function for **production**. Used automatically once deployed.
- `shared/tutorPrompt.js` — the AI Tutor's prompt-building and Gemini-call
  logic, shared by both the Express server and the Netlify function so they
  can't drift apart.

## Running locally

Start the backend first, then the frontend:

```bash
cd server && npm install && node index.js
```

```bash
cd client && npm install && npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api/*` requests to
the backend on `http://localhost:8787`.

## Deploying to Netlify

The repo includes a root-level `netlify.toml` that's already configured:

- Builds `client/` (`npm run build`) and publishes `client/dist`.
- Deploys `netlify/functions/tutor.js` as `/.netlify/functions/tutor`, with a
  redirect so the frontend's existing `fetch('/api/tutor')` calls keep
  working unchanged in production.
- Adds a SPA fallback (`/* → /index.html`) so client-side routes like
  `/world` or `/dashboard` don't 404 on refresh or direct link.

To deploy:

1. Push this repo to GitHub and connect it to a new Netlify site ("Import an
   existing project"). Netlify will read `netlify.toml` automatically — no
   manual build settings needed.
2. In **Site settings → Environment variables**, add `GEMINI_API_KEY` with
   your Gemini API key. Without it, the AI Tutor falls back to an offline
   demo reply instead of erroring.
3. Deploy. The site (including the AI Tutor) works standalone — no separate
   backend hosting required.

## Notable features

- Multi-step onboarding (school vs. college, grade/course/year, subjects,
  learning-style preferences) that drives a personalized learning profile.
- Interactive 3D worlds: Mathematics (live function surfaces), Physics
  (orbital gravity & projectile motion), Chemistry (atom/element combining
  with reaction detection), Biology (beating 3D heart with blood flow),
  Geography (interactive globe with landmarks), History (era timeline).
- Computer Science World: Sorting Arena (Bubble/Insertion/Selection/Merge/
  Quick/Heap sort, block-by-block animation) and Graph Laboratory
  (build-your-own graph + BFS/DFS/Dijkstra step-by-step visualization).
- Gemini-powered AI Tutor that adapts its explanations to the student's
  onboarding profile.
- A lightweight ML-style recommendation engine, knowledge constellation
  (3D mastery map), adaptive practice questions, XP/streaks/achievements.
