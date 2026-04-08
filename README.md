# Digital Wall Calendar

![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-FF0080)

Modern, animated, responsive wall calendar built with React + TypeScript + Tailwind.

It supports:
- month navigation with cinematic page-flip effects
- single-date and range-based note management
- tone-colored notes/events
- event fetching + local cache
- localStorage persistence for user data

## Project Preview

![Status](https://img.shields.io/badge/UI-Modern%20Aesthetic-2E8B57)
![Theme](https://img.shields.io/badge/Theme-Light%20%2F%20Dark-111827)
![Storage](https://img.shields.io/badge/Data-localStorage-orange)

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Architecture Diagram

```mermaid
flowchart LR
	subgraph UI[Presentation Layer]
		A[Index Page]
		B[WallCalendar]
		C[CalendarGrid]
		D[CalendarDay]
		E[CalendarNotes]
		F[EventChipInput]
		G[ThemeContext]
	end

	subgraph CORE[Domain Logic Layer]
		H[calendar-utils.ts]
		I[events.ts]
	end

	subgraph STORAGE[Client Storage Layer]
		J[(calendar-notes)]
		K[(calendar-notes-flat)]
		L[(calendar-events)]
		M[(month cache)]
	end

	subgraph API[External Integration]
		N[Nager.Date Holiday API]
	end

	A --> B
	B --> C
	C --> D
	B --> E
	B --> F
	B --> G

	B --> H
	B --> I

	H --> J
	H --> K
	I --> L
	I --> M
	I --> N
```

### Block Summary

1. Presentation Layer: renders calendar UI and handles user interactions.
2. Domain Logic Layer: computes date/range behavior, note/event transformations, and persistence rules.
3. Client Storage Layer: keeps notes/events and month cache in browser localStorage.
4. External Integration: fetches public holiday data and merges it into month events.

## Range Selection Flow

```mermaid
stateDiagram-v2
		[*] --> NormalDateMode

		NormalDateMode --> RangeArmed: Double click on a date
		NormalDateMode --> NormalDateMode: Single click (date selection only)

		RangeArmed --> RangeCompleted: Click second date
		RangeCompleted --> NormalDateMode

		RangeArmed --> NormalDateMode: Month change / reset
```

## Notes Storage Model

Notes are stored in multiple forms for rendering + readability:

1. Structured model (`calendar-notes`):

```json
{
	"monthNotes": {
		"2026-04": "..."
	},
	"dateNotes": {
		"2026-04-07": "..."
	},
	"rangeNotes": {
		"2026-04-05_2026-04-10": "..."
	}
}
```

2. Flat readable mirror (`calendar-notes-flat`):

```txt
dd/MM/yyyy - note
```

Range notes are expanded and mirrored across each date in that range so clicking any included day can render note indicators and date-note content.

## Events Data Flow

1. Events load from `localStorage`.
2. Month events fetch from public holiday API + local holiday sources.
3. Data is merged and deduplicated.
4. Month cache is stored for faster reloads.

## Features Implemented

- Animated month transitions (page-flip style)
- Fixed/compact grid behavior tuning
- Date selection + double-click-triggered range mode
- Month/Date/Range notes context
- Multiple notes per context
- Tone-based note/event color chips
- Dynamic notes/event side panel
- Year jump input (keyboard arrow support)
- Responsive layout (mobile + desktop)
- Light and dark theme support
- Background motion effects (time-travel inspired)

## Folder Guide

- `src/components/WallCalendar.tsx`: calendar shell, navigation, range orchestration, side panel
- `src/components/CalendarGrid.tsx`: weekday headers and month grid transition
- `src/components/CalendarDay.tsx`: per-day visuals, selection state, note/event indicators
- `src/components/CalendarNotes.tsx`: notes UI and contextual save flow
- `src/components/EventChipInput.tsx`: event add/list UI
- `src/lib/calendar-utils.ts`: date helpers, range helpers, note persistence
- `src/lib/events.ts`: event persistence, API fetch, merge logic
- `src/pages/Index.tsx`: page-level layout and animated background

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Scripts

- `npm run dev` - start dev server
- `npm run build` - create production build
- `npm run preview` - preview production build



