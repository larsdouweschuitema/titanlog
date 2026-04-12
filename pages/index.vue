<script setup lang="ts">
import { activeEvent, events } from '~/data/events'

const activeEvents = events.filter((event) => event.status === 'active')
const upcomingEvents = events.filter((event) => event.status === 'upcoming')
const pastEvents = events.filter((event) => event.status === 'completed')

const getEventWeekLabels = (weekTitles: string[]) => weekTitles.join(' · ')
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">Titan Fight Camp</p>
      <h1>Events</h1>
      <p class="overview-intro">
        Manage current camps, upcoming events, and archived fight histories in one place, while keeping week numbers scoped to each event.
      </p>

      <div class="stats-row">
        <div class="stats-card">
          <strong>{{ events.length }}</strong>
          <span>total events</span>
        </div>
        <div class="stats-card">
          <strong>{{ activeEvent.weeks.length }}</strong>
          <span>weeks in current camp</span>
        </div>
      </div>
    </section>

    <section class="week-section">
      <div class="section-header">
        <div>
          <p class="section-kicker">Current Camp</p>
          <h2 class="week-title">{{ activeEvent.name }}</h2>
          <p class="week-range">{{ activeEvent.organization }} · {{ activeEvent.location }} · {{ activeEvent.date }}</p>
        </div>
      </div>

      <div class="event-grid">
        <article
          v-for="event in activeEvents"
          :key="event.id"
          class="event-card event-card-active"
        >
          <span class="event-status-chip">Active</span>
          <h3>{{ event.name }}</h3>
          <p class="event-meta">{{ event.organization }} · {{ event.location }}</p>
          <p class="event-summary">{{ event.summary }}</p>
          <div class="event-card-footer">
            <span>{{ event.weeks.length }} camp weeks</span>
            <NuxtLink :to="`/events/${event.id}`" class="event-link">Open camp</NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <section class="week-section">
      <div class="section-header">
        <div>
          <p class="section-kicker">Upcoming</p>
          <h2 class="week-title">Next Events</h2>
          <p class="week-range">Future fight camps can already be outlined before the current camp ends.</p>
        </div>
      </div>

      <div class="event-grid">
        <article
          v-for="event in upcomingEvents"
          :key="event.id"
          class="event-card"
        >
          <span class="event-status-chip event-status-chip-upcoming">Upcoming</span>
          <h3>{{ event.name }}</h3>
          <p class="event-meta">{{ event.organization }} · {{ event.date }}</p>
          <p class="event-summary">{{ event.summary }}</p>
          <div class="event-chip-row">
            <span class="history-chip">{{ event.weeks.length }} planned weeks</span>
            <span class="history-chip">{{ getEventWeekLabels(event.weeks.map((week) => week.title)) }}</span>
          </div>
          <div class="event-card-footer">
            <span>{{ event.location }}</span>
            <NuxtLink :to="`/events/${event.id}`" class="event-link">View outline</NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <section class="week-section">
      <div class="section-header">
        <div>
          <p class="section-kicker">Archive</p>
          <h2 class="week-title">Past Events</h2>
          <p class="week-range">Archived camps keep their own week numbers and remain easy to review later.</p>
        </div>
      </div>

      <div class="event-grid">
        <article
          v-for="event in pastEvents"
          :key="event.id"
          class="event-card event-card-archive"
        >
          <span class="event-status-chip event-status-chip-completed">Archived</span>
          <h3>{{ event.name }}</h3>
          <p class="event-meta">{{ event.organization }} · {{ event.date }}</p>
          <p class="event-summary">{{ event.summary }}</p>
          <div class="history-list">
            <span
              v-for="week in event.weeks"
              :key="`${event.id}-${week.title}`"
              class="history-chip"
            >
              {{ week.title }}
            </span>
          </div>
          <div class="event-card-footer">
            <span>{{ event.weeks.length }} archived weeks</span>
            <NuxtLink :to="`/events/${event.id}`" class="event-link">Open archive</NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
