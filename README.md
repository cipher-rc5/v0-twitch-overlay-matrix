# Cipher Twitch Overlay

Production-focused Next.js overlay for OBS with voice-reactive visuals, ultrawide-first layout, and strict TypeScript safety.

## Stack

- Runtime and package manager: Bun
- Framework: Next.js (App Router) + React + TypeScript
- Styling: Tailwind and component-scoped styles
- Audio pipeline: Web Audio API (`AnalyserNode`)
- Formatting: dprint

## Scripts

```bash
bun run dev           # local development server
bun run build         # production build
bun run start         # run production build
bun run typecheck     # strict TypeScript validation
bun run format        # apply formatting
bun run format:check  # verify formatting
bun run check         # typecheck + build + formatting check
```

## Local Setup

```bash
bun install
bun run dev
```

## OBS Setup

1. Add a Browser Source.
2. Use your deployed URL or `http://localhost:3000`.
3. Set width to `3440` and height to `1440`.
4. Enable source refresh when scene becomes active.
5. Grant microphone access when prompted to enable voice-reactive effects.

## Architecture Notes

- Next.js-only runtime model (no parallel standalone React entrypoint).
- Explicit microphone permission flow with runtime state handling (`checking`, `prompt`, `requesting`, `ready`, `denied`, `error`).
- Voice analysis lifecycle includes cleanup for animation frames, audio nodes, and browser visibility state.

## Browser Support

- Chrome and Edge: full support
- Firefox: full support
- Safari: partial support depending on Web Audio and permission behavior
