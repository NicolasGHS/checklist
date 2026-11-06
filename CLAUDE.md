# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A cross-platform task manager desktop app (Things 3 inspired) built with **Wails v3** (desktop + iOS) — Go backend + React frontend packaged as a native binary. The app uses SQLite for persistence and supports tasks, subtasks, lists, areas, deadlines, and markdown notes.

## Commands

### Development

```bash
# Install frontend dependencies
cd client && npm install

# Run in dev mode (hot reload, Wails opens native window)
wails3 dev   # or: task dev

# Frontend-only dev server (no native window)
cd client && npm run dev
```

### Build

```bash
# Full production build (dispatches to build/<os>/Taskfile.yml)
wails3 build   # or: task build

# Regenerate the frontend bindings after changing public methods on App
wails3 generate bindings -d client/bindings -clean=true -ts -i

# Frontend-only build check
cd client && npm run build     # tsc + vite build
```

### Lint

```bash
cd client && npx eslint .
```

No Go tests exist in this repo currently.

## Architecture

### Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + Radix UI + shadcn/ui |
| State | React Context + custom window events |
| Drag & Drop | @dnd-kit |
| Backend | Go 1.26 with Wails v3 |
| ORM | GORM with SQLite |
| Database | `todos.db` in `os.UserConfigDir()/Checklist` (`~/Library/Application Support/Checklist` on macOS), or in the sync folder from `settings.json` there; auto-migrated on startup |

### Data Flow

React components → Wails-generated TS bindings (`bindings/checklist/app`, models in `bindings/checklist/core/models`) → `app.go` → `core/api/` → `core/repository/` → GORM/SQLite

`client/bindings/` is auto-generated — never edit it manually. To expose a new Go method to the frontend, add it as a public method on the `App` struct in `app.go` (registered as a Wails service in `main.go`) and regenerate the bindings (`wails3 dev`/`wails3 build` do this too). Go nil slices arrive as `null` and `time.Time` as ISO strings.

### Backend (`core/`)

- `core/models/` — GORM model structs (Todo, List, Area, Note)
- `core/repository/` — Raw CRUD operations against the DB
- `core/api/` — Business logic layer called by `app.go`
- `core/db/` — DB connection init and auto-migration

**Todo model key fields:** `ListID`, `ParentID` (subtasks), `Today` (bool flag, currently unused), `Deadline` (nullable; the Today view is deadline-based), `Archive` (bool, = Someday), `Position` / `TodayPosition` (manual order).

**Deadlines** are the last instant of the chosen local day (`endOfDayISO` in `client/src/utils/dates.ts`), sent as RFC3339 and stored in UTC. SQLite compares them as text, so Go query bounds must be converted with `.UTC()`.

**List 1 is the Inbox** (created on startup). Sidebar views other than Inbox are not lists: their drop targets use `drop-view-<view>` IDs and are handled in `layout.tsx`.

### Frontend (`client/src/`)

- `pages/` — Route-level components (Inbox, Today, Upcoming, Projects, Logbook, etc.)
- `components/` — Shared UI (TaskCard, Sidebar, Notebar, NewTodoCard, Page wrapper)
- `components/ui/` — shadcn/ui primitives (never modify these directly)
- `contexts/` — `CountContext` (sidebar badge counts), `ToolbarContext`
- `hooks/` — Data-fetching hooks that call Wails bindings (e.g. `useTodosByList`, `useOpenTodo`)
- `router/` — React Router v7 route definitions

### Cross-component Communication

State updates that need to propagate across unrelated components use `window.dispatchEvent(new CustomEvent(...))`. Pages listen for these events to re-fetch data after mutations. This pattern is used because Wails has no built-in reactive data layer.

### Path Aliases

- `@/*` → `client/src/*`
- `bindings/*` → `client/bindings/*` (Wails-generated bindings)

## Key Conventions

- All new Go API methods go on `App` in `app.go`, delegating immediately to `core/api/`
- Frontend data fetching always goes through hooks in `hooks/`, not inline in components
- Slugs are auto-generated for List and Area names via `gosimple/slug` on the Go side
- The app ships as a single native binary — no server, no network calls
