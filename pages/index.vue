<script setup lang="ts">
import { goals, scheduleWeeks, typeLabels } from '~/data/schedule'

type DisplayStatus = 'all' | 'training' | 'completed' | 'constraint' | 'event' | 'open'
type NoteEntry = {
  date: string
  dayLabel: string
  time: string
  session: string
  notes: string[]
}

const currentDate = new Date('2026-04-11T12:00:00')
const fightDate = new Date('2026-06-07T12:00:00')
const allEntries = scheduleWeeks.flatMap((week) => week.entries)
const openTrainingCount = allEntries.filter((entry) => entry.type === 'open' && entry.date >= currentDate.toISOString().slice(0, 10)).length
const daysUntilFight = Math.ceil((fightDate.getTime() - currentDate.getTime()) / 86400000)
const weeksUntilFight = Math.ceil(daysUntilFight / 7)
const recurringConstraintSessions = new Set(['Kantoordag'])
const selectedNoteEntry = ref<NoteEntry | null>(null)

const fixedConstraints = [
  'Dinsdag: 09:00-17:00 bezet',
  'Vrijdag: 09:00-17:00 bezet'
]
const currentDateKey = currentDate.toISOString().slice(0, 10)
const isPastEntry = (date: string) => date <= currentDateKey
const getEntryType = (entry: { date: string; type: string }) =>
  entry.type === 'training' && isPastEntry(entry.date) ? 'completed' : entry.type
const getEntryLabel = (entry: { date: string; type: string }) =>
  entry.type === 'training' && isPastEntry(entry.date) ? 'Voltooid' : typeLabels[entry.type as keyof typeof typeLabels]
const isCompletedTraining = (entry: { date: string; type: string }) =>
  entry.type === 'training' && isPastEntry(entry.date)
const statusFilters = [
  { key: 'all' as const, label: 'Alles' },
  { key: 'training' as const, label: 'Aankomend' },
  { key: 'completed' as const, label: 'Voltooid' },
  { key: 'open' as const, label: 'Trainingsopties' },
  { key: 'constraint' as const, label: 'Bezet' },
  { key: 'event' as const, label: 'Event' }
]
const activeFilters = ref<DisplayStatus[]>(['all'])

const toggleFilter = (filterKey: DisplayStatus) => {
  if (filterKey === 'all') {
    activeFilters.value = ['all']
    return
  }

  const nextFilters = activeFilters.value.filter((filter) => filter !== 'all')
  const hasFilter = nextFilters.includes(filterKey)
  const updated = hasFilter
    ? nextFilters.filter((filter) => filter !== filterKey)
    : [...nextFilters, filterKey]

  activeFilters.value = updated.length > 0 ? updated : ['all']
}

const isFilterActive = (filterKey: DisplayStatus) => activeFilters.value.includes(filterKey)
const matchesActiveFilters = (entry: { date: string; type: string }) => {
  if (activeFilters.value.includes('all')) return true
  return activeFilters.value.includes(getEntryType(entry) as DisplayStatus)
}

const getTimeOrder = (time: string) => {
  if (time === 'Hele dag') return 0
  if (time === 'Overdag') return 1
  if (time === 'Nog open') return 97
  if (time === 'Nog te bepalen') return 99

  const [hours = '23', minutes = '59'] = time.split('-')[0].split(':')
  return Number(hours) * 60 + Number(minutes)
}

const openNotes = (entry: NoteEntry) => {
  selectedNoteEntry.value = entry
}

const closeNotes = () => {
  selectedNoteEntry.value = null
}

const weekCards = computed(() => scheduleWeeks.map((week) => {
  const visibleEntries = week.entries.filter((entry) => !recurringConstraintSessions.has(entry.session))
  const filteredEntries = visibleEntries.filter((entry) => matchesActiveFilters(entry))

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare

    return getTimeOrder(a.time) - getTimeOrder(b.time)
  })

  const groupedDays = sortedEntries.reduce<Array<{ dayLabel: string; entries: typeof sortedEntries; isPastDay: boolean }>>((acc, entry) => {
    const lastGroup = acc[acc.length - 1]

    if (lastGroup && lastGroup.dayLabel === entry.dayLabel) {
      lastGroup.entries.push(entry)
      lastGroup.isPastDay = lastGroup.entries.every((groupEntry) => isCompletedTraining(groupEntry))
      return acc
    }

    acc.push({
      dayLabel: entry.dayLabel,
      entries: [entry],
      isPastDay: isCompletedTraining(entry)
    })

    return acc
  }, [])

  return {
    ...week,
    isPastWeek: sortedEntries.length > 0 && sortedEntries[sortedEntries.length - 1].date < currentDateKey,
    groupedDays
  }
}))
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">Titan Training Camp</p>
      <h1>Weekoverzicht</h1>

      <div class="goal-grid">
        <article
          v-for="goal in goals"
          :key="goal.label"
          class="goal-card"
        >
          <span>{{ goal.detail }}</span>
          <strong>{{ goal.label }}</strong>
          <small>{{ goal.date }}</small>
        </article>
      </div>

      <div class="stats-row">
        <div>
          <strong>{{ openTrainingCount }}</strong>
          <span>nog boekbare trainingsopties</span>
        </div>
        <div>
          <strong>{{ weeksUntilFight }}</strong>
          <span>weken tot Almere's Finest vanaf 11 april 2026</span>
        </div>
      </div>

      <div class="constraint-strip">
        <span class="constraint-label">Vaste beperkingen</span>
        <span
          v-for="constraint in fixedConstraints"
          :key="constraint"
          class="constraint-chip"
        >
          {{ constraint }}
        </span>
      </div>

      <div class="filter-strip">
        <span class="constraint-label">Filter op status</span>
        <button
          v-for="filter in statusFilters"
          :key="filter.key"
          type="button"
          class="filter-chip"
          :class="{ 'filter-chip-active': isFilterActive(filter.key) }"
          @click="toggleFilter(filter.key)"
        >
          {{ filter.label }}
        </button>
      </div>
    </section>

    <section
      v-for="week in weekCards"
      :key="`${week.title}-${week.rangeLabel}`"
      class="week-section"
      :class="{ 'week-section-past': week.isPastWeek }"
    >
      <div class="section-header">
        <div>
          <h2 class="week-title">{{ week.title }}</h2>
          <p class="week-range">{{ week.rangeLabel }}</p>
        </div>
      </div>

      <div class="day-grid">
        <article
          v-for="day in week.groupedDays"
          :key="`${week.title}-${day.dayLabel}`"
          :id="`day-${day.entries[0].date}`"
          class="day-card"
          :class="{ 'day-card-past': day.isPastDay }"
        >
          <div class="day-card-header">
            <h3>{{ day.dayLabel }}</h3>
          </div>

          <div
            v-for="(entry, entryIndex) in day.entries"
            :key="`${week.title}-${day.dayLabel}-${entryIndex}-${entry.time}`"
            class="time-block"
            :class="{ 'time-block-clickable': entry.notes?.length }"
            :tabindex="entry.notes?.length ? 0 : undefined"
            :role="entry.notes?.length ? 'button' : undefined"
            @click="entry.notes?.length ? openNotes(entry as NoteEntry) : undefined"
            @keydown.enter="entry.notes?.length ? openNotes(entry as NoteEntry) : undefined"
            @keydown.space.prevent="entry.notes?.length ? openNotes(entry as NoteEntry) : undefined"
          >
            <div class="time-block-top">
              <span class="time-label">{{ entry.time }}</span>
              <span class="status-pill" :data-type="getEntryType(entry)">
                {{ getEntryLabel(entry) }}
              </span>
            </div>

            <strong class="session-label">{{ entry.session }}</strong>
            <span v-if="entry.notes?.length" class="notes-trigger">
              Bekijk notities
            </span>
          </div>

          <div class="day-card-footer">
            <NuxtLink
              :to="`/logboek#day-${day.entries[0].date}`"
              class="day-icon-link"
              aria-label="Ga naar logboek voor deze dag"
              title="Ga naar logboek"
            >
              🍽
            </NuxtLink>
          </div>
        </article>

        <article
          v-if="week.groupedDays.length === 0"
          class="day-card day-card-empty"
        >
          <h3>Geen sessies in deze filter</h3>
        </article>
      </div>
    </section>

    <div
      v-if="selectedNoteEntry"
      class="notes-overlay"
      @click.self="closeNotes"
    >
      <section class="notes-modal">
        <div class="notes-modal-header">
          <div>
            <p class="section-kicker">{{ selectedNoteEntry.dayLabel }}</p>
            <h2 class="notes-title">{{ selectedNoteEntry.session }}</h2>
            <p class="week-range">{{ selectedNoteEntry.time }}</p>
          </div>
          <button type="button" class="notes-close" @click="closeNotes">Sluit</button>
        </div>

        <ul class="notes-list">
          <li v-for="note in selectedNoteEntry.notes" :key="note">{{ note }}</li>
        </ul>
      </section>
    </div>
  </main>
</template>
