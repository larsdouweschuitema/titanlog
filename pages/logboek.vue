<script setup lang="ts">
import { campLogs, getDailyTotals } from '~/data/logbook'

const currentDate = new Date('2026-04-12T12:00:00')
const todayKey = currentDate.toISOString().slice(0, 10)
const goalWeightKg = 95
const startWeightKg = 86.8
const hasLogData = (log: typeof campLogs[number]) =>
  Object.keys(log.meals).length > 0 ||
  Boolean(log.sleepHours) ||
  Boolean(log.weightKg) ||
  Boolean(log.bodyFatPercentage)

const visibleLogs = campLogs.filter(hasLogData)

const currentWeightKg = [...visibleLogs].reverse().find((log) => log.weightKg)?.weightKg ?? startWeightKg
const currentBodyFat = [...visibleLogs].reverse().find((log) => log.bodyFatPercentage)?.bodyFatPercentage
const goalDate = new Date('2026-06-07T12:00:00')
const daysUntilGoal = Math.max(1, Math.ceil((goalDate.getTime() - currentDate.getTime()) / 86400000))
const kilosRemaining = Math.max(0, goalWeightKg - currentWeightKg)
const previousWeightKg = [...visibleLogs]
  .filter((log) => log.weightKg && log.date < todayKey)
  .reverse()
  .find((log) => log.weightKg)?.weightKg
const weightDelta = previousWeightKg ? currentWeightKg - previousWeightKg : 0
const maintenanceEstimate = Math.round(currentWeightKg * 33)
const dailySurplusNeeded = Math.round((kilosRemaining * 7700) / daysUntilGoal)
const dailyCalorieTarget = maintenanceEstimate + dailySurplusNeeded

const logWeeks = Object.values(
  visibleLogs.reduce<Record<string, { weekTitle: string; logs: typeof visibleLogs }>>((acc, log) => {
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

const sleepLogs = visibleLogs.filter((log) => log.sleepHours)
const averageSleep = sleepLogs.length
  ? (sleepLogs.reduce((sum, log) => sum + (log.sleepHours ?? 0), 0) / sleepLogs.length).toFixed(1)
  : '—'

const mealLabels = {
  ontbijt: 'Ontbijt',
  lunch: 'Lunch',
  diner: 'Diner',
  snacks: 'Snacks'
} as const

const formatWeightDelta = (value: number) => {
  if (value === 0) return '0.0 kg'
  return `${value > 0 ? '+' : ''}${value.toFixed(1)} kg`
}
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">Titan Training Camp</p>
      <h1>Logboek</h1>

      <div class="stats-row">
        <div>
          <strong>{{ currentWeightKg.toFixed(1) }} kg</strong>
          <span>huidig gewicht, {{ formatWeightDelta(weightDelta) }} vs vorige meting</span>
        </div>
        <div>
          <strong>{{ averageSleep }}</strong>
          <span>gemiddelde slaapuren</span>
        </div>
        <div>
          <strong>{{ currentBodyFat?.toFixed(1) ?? '—' }}%</strong>
          <span>laatst gemeten vetpercentage</span>
        </div>
      </div>

      <div class="formula-card">
        <p class="log-section-title">Doelgewicht</p>
        <h2 class="formula-title">{{ goalWeightKg }} kg richting 7 juni 2026</h2>
        <p class="formula-text">
          Rekening: {{ currentWeightKg.toFixed(1) }} kg huidig gewicht, {{ kilosRemaining.toFixed(1) }} kg te gaan,
          {{ daysUntilGoal }} dagen resterend, ongeveer 7.700 kcal per kilo lichaamsgewicht.
        </p>
        <div class="metric-row">
          <span class="metric-pill">Onderhoud ca. {{ maintenanceEstimate }} kcal</span>
          <span class="metric-pill">Benodigde surplus ca. {{ dailySurplusNeeded }} kcal/dag</span>
          <span class="metric-pill">Doel ca. {{ dailyCalorieTarget }} kcal/dag</span>
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
          <p class="week-range">Er is nog geen log toegevoegd.</p>
        </div>
      </div>

      <div class="day-grid">
        <article class="day-card day-card-empty log-empty-card">
          <h3>Geen logboekitems</h3>
          <p class="log-empty">Voeg je eerste dag toe met gewicht, slaap en voeding om hier overzicht te krijgen.</p>
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
          <p class="week-range">Dagelijkse voeding, herstel en trainingscontext</p>
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

          <div class="log-section">
            <p class="log-section-title">Voeding</p>
            <div v-if="Object.keys(log.meals).length" class="meal-grid">
              <div
                v-for="(label, key) in mealLabels"
                :key="key"
                class="meal-card"
              >
                <template v-if="log.meals[key]">
                  <strong>{{ label }}</strong>
                  <ul class="log-list">
                    <li v-for="item in log.meals[key]?.items" :key="item">{{ item }}</li>
                  </ul>
                  <p class="meal-macros">
                    {{ log.meals[key]?.macros.calories }} kcal ·
                    P {{ log.meals[key]?.macros.protein }} ·
                    KH {{ log.meals[key]?.macros.carbs }} ·
                    V {{ log.meals[key]?.macros.fat }}
                  </p>
                </template>
                <template v-else />
              </div>
            </div>
          </div>

          <div v-if="getDailyTotals(log).calories > 0" class="metric-row">
            <span class="metric-pill">Totaal {{ getDailyTotals(log).calories }} kcal</span>
            <span class="metric-pill">P {{ getDailyTotals(log).protein }} g</span>
            <span class="metric-pill">KH {{ getDailyTotals(log).carbs }} g</span>
            <span class="metric-pill">V {{ getDailyTotals(log).fat }} g</span>
          </div>

          <div
            v-if="log.weightKg || log.bodyFatPercentage || log.sleepHours"
            class="metric-row"
          >
            <span v-if="log.weightKg" class="metric-pill">Gewicht {{ log.weightKg }} kg</span>
            <span v-if="log.bodyFatPercentage" class="metric-pill">Vet {{ log.bodyFatPercentage }}%</span>
            <span v-if="log.sleepHours" class="metric-pill">Slaap {{ log.sleepHours }} u</span>
          </div>

          <div class="day-card-footer">
            <NuxtLink
              :to="`/#day-${log.date}`"
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
