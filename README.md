# Titanlog

Titanlog is a Nuxt 3 app for managing fight camps across multiple events.

It combines:

- an event overview
- a per-event camp planner with week numbers
- a daily logbook for nutrition, sleep, weight, and body fat

The app is built to support both the current camp and future events, while keeping each event's training history separate.

## What the app does

### Events overview

The homepage shows:

- the current active event
- upcoming events
- links into each event-specific camp view

### Event camp view

Each event has its own planning page with:

- camp weeks
- grouped training days
- session details and trainer names
- completion states
- constraints
- bookable training options
- WhatsApp sharing for open training slots
- weekly totals by training category

### Logbook

The logbook is a separate page for daily tracking such as:

- meals and macros
- sleep
- weight
- body fat percentage

## Core features

- multi-event planning structure
- event-specific camp timelines
- week-based training overview
- clickable training notes
- status filters for training, completed sessions, constraints, events, and training options
- compact category tags on sessions such as `Conditioning`, `Strength`, `Technique`, and `Sparring`
- weekly category counters
- WhatsApp sharing for bookable training options
- responsive layout for desktop and mobile

## Tech stack

- Nuxt 3
- Vue 3
- plain CSS

## Project structure

```text
app.vue                        Top-level navigation
assets/css/main.css            Global styling and theme
components/EventCampView.vue   Reusable event camp planner UI
data/events.ts                 Event definitions and event metadata
data/schedule.ts               Camp schedule data for the active event
data/logbook.ts                Daily logbook data
pages/index.vue                Event overview page
pages/events/[id].vue          Event-specific camp detail page
pages/logboek.vue              Logbook page
```

## Local development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run the production build locally:

```bash
npm run start
```

## Updating event data

### Events

Event metadata lives in [data/events.ts](/Users/username/Documents/GitHub/titanlog/data/events.ts).

Use it to:

- add new events
- mark an event as active or upcoming
- define the event name, date, location, and summary
- connect event-specific week data

### Schedule

Camp schedule data lives in [data/schedule.ts](/Users/username/Documents/GitHub/titanlog/data/schedule.ts).

Use it to:

- define weeks and date ranges
- add or update sessions
- add trainer names via `detail`
- add notes via `notes`
- add category tags via `tags`
- add bookable training slots with `type: 'open'`

Example:

```ts
{
  date: '2026-04-16',
  dayLabel: 'Donderdag 16 apr',
  time: '10:00-11:00',
  session: 'Personal training',
  detail: 'Treffel',
  tags: ['Conditie', 'Kracht'],
  type: 'training'
}
```

### Logbook

Daily log data lives in [data/logbook.ts](/Users/username/Documents/GitHub/titanlog/data/logbook.ts).

## Deployment

The repository is connected to GitHub and intended for deployment on Vercel.
