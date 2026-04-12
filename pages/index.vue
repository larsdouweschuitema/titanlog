<script setup lang="ts">
import { activeEvent, events } from '~/data/events'

const activeEvents = events.filter((event) => event.status === 'active')
const upcomingEvents = events.filter((event) => event.status === 'upcoming')

const getEventWeekLabels = (weekTitles: string[]) => weekTitles.join(' · ')
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">Titan Fight Camp</p>
      <h1>Events</h1>
      <p class="overview-intro">
        Een duidelijk overzicht van het huidige kamp en het volgende event op de planning.
      </p>

      <div class="stats-row">
        <div class="stats-card">
          <strong>{{ events.length }}</strong>
          <span>aantal events</span>
        </div>
        <div class="stats-card">
          <strong>{{ activeEvent.weeks.length }}</strong>
          <span>weken in huidig kamp</span>
        </div>
      </div>
    </section>

    <section class="week-section">
      <div class="section-header">
        <div>
          <p class="section-kicker">Huidig Kamp</p>
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
          <span class="event-status-chip">Actief</span>
          <h3>{{ event.name }}</h3>
          <p class="event-meta">{{ event.organization }} · {{ event.location }}</p>
          <p class="event-summary">{{ event.summary }}</p>
          <div class="event-card-footer">
            <span>{{ event.weeks.length }} kampweken</span>
            <NuxtLink :to="`/events/${event.id}`" class="event-link">Open kamp</NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <section class="week-section">
      <div class="section-header">
        <div>
          <p class="section-kicker">Aankomend</p>
          <h2 class="week-title">Volgende Events</h2>
          <p class="week-range">Events die volgen na het huidige kamp.</p>
        </div>
      </div>

      <div class="event-grid">
        <article
          v-for="event in upcomingEvents"
          :key="event.id"
          class="event-card"
        >
          <span class="event-status-chip event-status-chip-upcoming">Aankomend</span>
          <h3>{{ event.name }}</h3>
          <p class="event-meta">{{ event.organization }} · {{ event.date }}</p>
          <p class="event-summary">{{ event.summary }}</p>
          <div v-if="event.weeks.length" class="event-chip-row">
            <span class="history-chip">{{ event.weeks.length }} geplande weken</span>
            <span class="history-chip">{{ getEventWeekLabels(event.weeks.map((week) => week.title)) }}</span>
          </div>
          <p v-else class="event-summary">Nog geen weken ingepland.</p>
          <div class="event-card-footer">
            <span>{{ event.location }}</span>
            <NuxtLink :to="`/events/${event.id}`" class="event-link">Bekijk event</NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
