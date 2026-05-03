# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A cross-platform task manager desktop app (Things 3 inspired) built with **Wails v2** — Go backend + React frontend packaged as a native binary. The app uses SQLite for persistence and supports tasks, subtasks, lists, areas, deadlines, and markdown notes.

## Commands

### Development

```bash
# Install frontend dependencies
cd client && npm install

# Run in dev mode (hot reload, Wails opens native window)
wails dev

# Frontend-only dev server (no native window)
cd client && npm run dev
```

### Build

```bash
# Full production build
wails build

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
| Backend | Go 1.24 with Wails v2 |
| ORM | GORM with SQLite |
| Database | `~/.config/Checklist/todos.db` (auto-migrated on startup) |

### Data Flow

React components → Wails-generated JS bindings (`wailsjs/go/main/App`) → `app.go` → `core/api/` → `core/repository/` → GORM/SQLite

The `wailsjs/` directory is auto-generated — never edit it manually. To expose a new Go method to the frontend, add it as a public method on the `App` struct in `app.go` and re-run `wails dev` or `wails build`.

### Backend (`core/`)

- `core/models/` — GORM model structs (Todo, List, Area, Note)
- `core/repository/` — Raw CRUD operations against the DB
- `core/api/` — Business logic layer called by `app.go`
- `core/db/` — DB connection init and auto-migration

**Todo model key fields:** `ListID`, `ParentID` (subtasks), `Today` (bool flag), `Deadline` (nullable), `Archive` (bool).

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
- `wailsjs/*` → `wailsjs/*` (Wails-generated bindings)

## Key Conventions

- All new Go API methods go on `App` in `app.go`, delegating immediately to `core/api/`
- Frontend data fetching always goes through hooks in `hooks/`, not inline in components
- Slugs are auto-generated for List and Area names via `gosimple/slug` on the Go side
- The app ships as a single native binary — no server, no network calls
