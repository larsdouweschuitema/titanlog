<script setup lang="ts">
import { activeEvent } from '~/data/events'
import { campLogs } from '~/data/logbook'

const formatDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const currentDate = new Date()
const todayKey = formatDateKey(currentDate)
const startWeightKg = 86.8
const weightLogs = campLogs.filter((log) => Boolean(log.weightKg))
const currentWeightLog = [...weightLogs].reverse()[0]
const previousWeightLog = [...weightLogs].reverse()[1]

const currentWeightKg = currentWeightLog?.weightKg ?? startWeightKg
const previousWeightKg = previousWeightLog?.weightKg
const weightDelta = previousWeightKg ? currentWeightKg - previousWeightKg : 0

const logWeeks = Object.values(
  weightLogs.reduce<Record<string, { weekTitle: string; logs: typeof weightLogs }>>((acc, log) => {
    const key = log.weekTitle || 'Kamp'

    if (!acc[key]) {
      acc[key] = { weekTitle: key, logs: [] }
    }

    acc[key].logs.push(log)
    return acc
  }, {})
).map((week) => ({
  ...week,
  logs: week.logs.sort((a, b) => a.date.localeCompare(b.date))
}))

const formatWeightDelta = (value: number) => {
  if (value === 0) return '0.0 kg'
  return `${value > 0 ? '+' : ''}${value.toFixed(1)} kg`
}
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">Titan Training Camp</p>
      <h1>Gewicht</h1>

      <div class="stats-row">
        <div>
          <strong>{{ currentWeightKg.toFixed(1) }} kg</strong>
          <span>huidig gewicht, {{ formatWeightDelta(weightDelta) }} vs vorige meting</span>
        </div>
      </div>
    </section>

    <section
      v-if="logWeeks.length === 0"
      class="week-section"
    >
      <div class="section-header">
        <div>
          <h2 class="week-title">Nog leeg</h2>
          <p class="week-range">Er is nog geen gewicht gelogd.</p>
        </div>
      </div>

      <div class="day-grid">
        <article class="day-card day-card-empty log-empty-card">
          <h3>Geen gewicht</h3>
          <p class="log-empty">Voeg je eerste gewichtsmeting toe om hier overzicht te krijgen.</p>
        </article>
      </div>
    </section>

    <section
      v-for="week in logWeeks"
      :key="week.weekTitle"
      class="week-section"
    >
      <div class="section-header">
        <div>
          <h2 class="week-title">{{ week.weekTitle }}</h2>
          <p class="week-range">Gewichtsmetingen per dag</p>
        </div>
      </div>

      <div class="day-grid">
        <article
          v-for="log in week.logs"
          :key="log.date"
          :id="`day-${log.date}`"
          class="day-card log-card log-card-fixed"
          :class="{ 'log-card-today': log.date === todayKey }"
        >
          <div class="log-card-header">
            <h3>{{ log.dayLabel }}</h3>
          </div>

          <div class="metric-row">
            <span v-if="log.weightKg" class="metric-pill">Gewicht {{ log.weightKg }} kg</span>
          </div>

          <div class="day-card-footer">
            <NuxtLink
              :to="`/events/${activeEvent.id}#day-${log.date}`"
              class="day-icon-link"
              aria-label="Ga naar trainingsoverzicht voor deze dag"
              title="Ga naar trainingsoverzicht"
            >
              🥊
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
