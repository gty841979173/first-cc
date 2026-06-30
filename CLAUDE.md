# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pomodoro Timer** - A Tauri desktop application with vanilla HTML/CSS/JS frontend. The app implements a Pomodoro timer with work sessions (25 min), short breaks (5 min), and long breaks (15 min after every 4 work sessions).

## Build Commands

```bash
cd pomodoro
npm run tauri dev    # Start development mode
npm run tauri build # Build for production
```

## Architecture

- **Frontend**: `pomodoro/src/` - Vanilla HTML, CSS, JS (no framework)
- **Backend**: `pomodoro/src-tauri/` - Tauri/Rust configuration
- **Entry**: `pomodoro/src/index.html` loads `main.js` and `styles.css`
- **Window Config**: `pomodoro/src-tauri/tauri.conf.json` (360×480, non-resizable, centered)
- **Notifications**: Uses Tauri notification plugin (`plugins.notification.all: true`)

## Key Files

- `pomodoro/src/main.js` - Timer logic, state machine, UI updates
- `pomodoro/src/styles.css` - Dark theme styling (Deep Charcoal `#1a1a2e` background)
- `SPEC.md` - Full UI/UX specification and acceptance criteria

## Session Flow

1. Work Session (25:00) → Short Break (5:00)
2. After 4 Work Sessions → Long Break (15:00)
3. Auto-advance with 3-second countdown between sessions
4. System notification on session completion

## Keyboard Shortcuts

- **Space**: Start/Pause toggle
- **R**: Reset timer
