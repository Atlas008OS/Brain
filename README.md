# BrainOps

Operational intelligence app: capture live voice conversations, auto-document them into SOPs (Standard Operating Procedures), and manage them through a Process Library.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Zustand (state, persisted to `localStorage`)
- Framer Motion (animated voice bubble)
- React Router
- ElevenLabs Conversational AI (`@elevenlabs/react`) for the real-time voice agent

## 1. Install Node.js

This machine doesn't have Node.js installed yet. Install the LTS version first:

- Download: https://nodejs.org (LTS)
- Or via winget (PowerShell): `winget install OpenJS.NodeJS.LTS`

Verify afterwards:

```powershell
node -v
npm -v
```

## 2. Install dependencies

From this folder:

```powershell
npm install
```

## 3. Run the app

```powershell
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). The layout is mobile-first (max-width shell) — for the best preview, open your browser's device toolbar (F12 → toggle device toolbar) or resize the window narrow.

## Voice Agent

The app is wired to the ElevenLabs Conversational AI agent `agent_6501kz2xb6zefavrwzkzdwtepvth` (see `src/lib/voiceAgent.tsx`). It connects via WebRTC directly from the browser — no API key required for this public agent config.

Flow:

1. **Home → "Start Documentation"** requests microphone permission and opens a live WebRTC session with the agent, then navigates to the **Agent** screen.
2. The **Agent** screen shows an animated bubble that reacts to conversation state (connecting / listening / speaking), plus a live transcript built from the agent's `onMessage` events.
3. **Stop Agent** ends the session, runs the transcript through a lightweight local summarizer (`src/lib/transcriptToProcess.ts`) that extracts a title and step list, saves it as a new **Draft** process, logs the event in the Activity Log, and opens it in the **Editor** for review.
4. Every step can be checked off, edited, added, or removed in the Editor; status can be moved from Draft → Needs Review → Published. All changes update Home's coverage ring, the Library list, and the Analytics dashboard in real time.

> Note: the automatic transcript → step extraction is a simple heuristic (sentence splitting), not an LLM call — it keeps everything client-side with no extra API key. If you want GPT/Claude-quality summarization of the transcript into structured steps, we can wire an LLM call in `transcriptToProcess.ts` next (needs an API key + a small backend or serverless function, since the key can't live in client code).

## Data persistence

Everything (processes, steps, activity log, department completeness) is stored in the browser's `localStorage` under the key `brainops-storage`. Clear it from **Settings → Clear local data**, or by clearing site data in devtools.

## Project structure

```
src/
  components/   Shared UI (BottomNav, TopBar, VoiceBubble, ProcessCard, ProgressRing, StatTile)
  lib/           store.ts (zustand), voiceAgent.tsx (ElevenLabs context), seed.ts, transcriptToProcess.ts
  pages/         Home, Agent, Library, Editor, Analytics, Settings
  App.tsx        Routing + layout shell
```

## Build for production

```powershell
npm run build
npm run preview
```
