# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"Pocket Grimoire" — a browser-based companion for hosting the tabletop game **Blood on the Clocktower (BOTC)**. No build step; static files served directly via Vercel.

## Development

No build, lint, or test tooling. Edit files directly and open in browser. Deploy via `git push` to Vercel.

To preview locally, serve the directory with any static file server:
```bash
npx serve .
```

## Architecture

**Tech stack:** Alpine.js 3 (reactivity), Pico CSS 2 (styling), custom PubSub SDK over WebSockets (real-time sync), localStorage via Alpine persist plugin.

**Two views:**
- `index.html` — Storyteller Grimoire (read/write)
- `square.html` — Town Square for players (read-only)

Both share `site.js` as a single Alpine.js component (`x-data="botc"`).

**Core data model** (persisted to localStorage):
```
data.set          — active edition (TB, BMR, SV, NGJ, OTI)
data.players[]    — {initial, status, role, group, markers[], addedMarker}
data.sharer       — {active, show, index} — sequential role reveal state machine
data.prompter     — {active, message} — ST night phase prompts
```

**Static game data** in `site.js`:
- `BOTC.roleCounts` — maps player count (5–15) → `[Townsfolk, Outsider, Minion, Demon]`
- `BOTC.sets` — 5 editions, each with `{name, roles{townsfolk[], outsider[], minion[], demon[]}}`
- `BOTC.orders` — `{firstNight[], otherNights[]}` — ordered role action sequences for night phases

**Real-time sync:** Grimoire publishes state changes to `wss://pubsub.h.kvn.pt`; Town Square subscribes. Multi-device play where ST controls one device, players view another.

**Role sharing flow:** `sharer` is a state machine — ST steps through players sequentially, briefly revealing each player's role on the shared screen.
