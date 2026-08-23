# Stay Fit — Fitness Center Website

A multi-scene, scroll-driven 3D website for STAY FIT Fitness Center, built with
React + TypeScript, Tailwind CSS v4, Framer Motion, and Three.js
(`@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`).

## Stack

- **React 19 + TypeScript** via Vite
- **Tailwind CSS v4** (brand tokens defined in `src/index.css`)
- **Framer Motion** for scroll-linked transforms and UI animation
- **Three.js / R3F / drei / postprocessing** for the pinned 3D scroll experience

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## Structure

- `src/components/canvas/` — the persistent 3D `<Experience>` canvas, camera
  rig, lighting, procedural models (dumbbell, barbell, kinetic mesh, solarium
  sphere), and video/gradient scene backdrops.
- `src/components/sections/` — page sections. The four hero-to-solarium
  scenes are pinned via `ScrollStory` and split into `*Backdrop` /
  `*Content` pairs so the shared 3D canvas can render between the video
  background and the foreground typography.
- `src/hooks/` — `useScrollScenes` (scroll progress context) and
  `useSceneRange` (per-scene opacity/local-progress helpers).
- `src/lib/` — scroll-math helpers (`scroll3d.ts`) shared between the DOM
  (Framer Motion) and R3F (`useFrame`) layers.
- `src/data/` — reels and membership plan/add-on content.

## Replacing placeholder media

No stock video/audio assets are bundled. Each scene's `<video>` element
points at a path under `public/videos/` (e.g. `gym-tour.mp4`,
`heavy-lifting.mp4`, `cardio.mp4`, `solarium.mp4`, and `reels/reel-1.mp4`
through `reel-6.mp4`). Until real footage is added, each scene falls back to
its themed CSS gradient automatically — drop matching files into
`public/videos/` to upgrade them to real footage with no code changes.

The WhatsApp number in `src/lib/constants.ts` (`WHATSAPP_NUMBER`) is a
placeholder — replace it with the gym's real WhatsApp Business number before
launch.
