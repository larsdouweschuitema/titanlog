# Titanlog

Nuxt 3 app for managing Titan's fight camp planning, training schedule, and daily logbook.

The app has two main sections:

- `Week overview`: weekly training schedule, including fixed sessions, constraints, events, trainers, notes, and bookable training options
- `Logbook`: space for daily nutrition, sleep, and body metrics

## Features

- weekly fight camp planning
- status filters for `Completed`, `Busy`, `Training options`, and `Event`
- clickable training notes per session
- WhatsApp share link for bookable training options
- trainer details on relevant sessions
- mobile-friendly layout

## Project structure

```text
data/schedule.ts     Training schedule and week data
data/logbook.ts      Daily logbook data
pages/index.vue      Week overview
pages/logboek.vue    Nutrition and recovery overview
assets/css/main.css  Styling
```

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

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

## Update the schedule

Most of the planning content lives in [data/schedule.ts](/Users/username/Documents/GitHub/titanlog/data/schedule.ts).

There you can:

- edit weeks
- add individual sessions
- update event goals
- add trainers via `detail`
- add notes via `notes`
- add bookable training windows with `type: 'open'`

Example session:

```ts
{
  date: '2026-04-16',
  dayLabel: 'Thursday 16 Apr',
  time: '10:00-11:00',
  session: 'Personal training',
  detail: 'Treffel',
  type: 'training'
}
```

## Update the logbook

Daily logbook data lives in [data/logbook.ts](/Users/username/Documents/GitHub/titanlog/data/logbook.ts).

## Deploy

The repository is connected to GitHub and used for deployment on Vercel.
