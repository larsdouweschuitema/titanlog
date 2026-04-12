<script setup lang="ts">
import type { FightEvent } from '~/data/events'
import type { ScheduleEntry, TrainingTag } from '~/data/schedule'
import { typeLabels } from '~/data/schedule'

type DisplayStatus = 'all' | 'training' | 'completed' | 'constraint' | 'event' | 'open'
type NoteEntry = {
  date: string
  dayLabel: string
  time: string
  session: string
  notes: string[]
}
type ShareableEntry = {
  date: string
  dayLabel: string
  time: string
  session: string
}
type TagCount = {
  tag: TrainingTag
  count: number
}

const props = defineProps<{
  event: FightEvent
}>()

const currentDate = new Date('2026-04-12T12:00:00')
const eventDate = new Date(`${props.event.date}T12:00:00`)
const allEntries = props.event.weeks.flatMap((week) => week.entries)
const openTrainingCount = allEntries.filter((entry) => entry.type === 'open' && entry.date >= currentDate.toISOString().slice(0, 10)).length
const daysUntilFight = Math.ceil((eventDate.getTime() - currentDate.getTime()) / 86400000)
const weeksUntilFight = Math.max(0, Math.ceil(daysUntilFight / 7))
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
const getEntryLabel = (entry: { date: string; type: string }) => {
  if (entry.type === 'training') {
    return isPastEntry(entry.date) ? 'Voltooid' : ''
  }

  return typeLabels[entry.type as keyof typeof typeLabels]
}
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

const showOpenTrainingOptions = () => {
  activeFilters.value = ['open']
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

const getWhatsappShareUrl = (entry: ShareableEntry) => {
  const message = [
    'Hi Lars, ik kan deze trainingsoptie oppakken:',
    `${entry.dayLabel}`,
    `${entry.time}`,
    '',
    'Laat maar weten of je dit wilt inboeken.'
  ].join('\n')

  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

const trainingTagOrder: TrainingTag[] = ['Conditie', 'Kracht', 'Techniek', 'Sparren']
const getTrainingCount = (entries: ScheduleEntry[]) => entries.filter((entry) => entry.type === 'training').length
const getWeekTagCounts = (entries: ScheduleEntry[]): TagCount[] => {
  const counts = new Map<TrainingTag, number>()

  entries
    .filter((entry) => entry.type === 'training')
    .forEach((entry) => {
      entry.tags?.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      })
    })

  return trainingTagOrder
    .filter((tag) => counts.has(tag))
    .map((tag) => ({ tag, count: counts.get(tag) ?? 0 }))
}

const averageTrainingPerWeek = props.event.weeks.length
  ? (props.event.weeks.reduce((sum, week) => sum + getTrainingCount(week.entries), 0) / props.event.weeks.length).toFixed(1)
  : '0.0'

const weekCards = computed(() => props.event.weeks
  .map((week) => {
    const weekTagCounts = getWeekTagCounts(week.entries)
    const trainingCount = getTrainingCount(week.entries)
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
      groupedDays,
      weekTagCounts,
      trainingCount
    }
  })
  .filter((week) => week.groupedDays.length > 0))
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">Event Kamp</p>
      <h1>{{ event.name }}</h1>

      <div class="goal-grid">
        <article class="goal-card">
          <span>{{ event.organization }}</span>
          <strong>{{ event.location }}</strong>
          <small>{{ event.date }}</small>
        </article>
      </div>

      <div class="stats-row">
        <button
          type="button"
          class="stats-card stats-card-action"
          :class="{ 'stats-card-active': isFilterActive('open') }"
          @click="showOpenTrainingOptions"
        >
          <strong>{{ openTrainingCount }}</strong>
          <span>boekbare trainingsopties</span>
        </button>
        <div class="stats-card">
          <strong>{{ weeksUntilFight }}</strong>
          <span>weken resterend</span>
        </div>
        <div class="stats-card">
          <strong>{{ event.weeks.length }}</strong>
          <span>kampweken</span>
        </div>
        <div class="stats-card">
          <strong>{{ averageTrainingPerWeek }}</strong>
          <span>gemiddeld aantal trainingen per week</span>
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
          <p class="week-training-total">{{ week.trainingCount }} trainingen deze week</p>
          <div v-if="week.weekTagCounts.length" class="week-tag-summary">
            <span class="week-tag-summary-label">Aantal trainingen per categorie:</span>
            <span
              v-for="item in week.weekTagCounts"
              :key="`${week.title}-${item.tag}`"
              class="week-tag-pill"
            >
              {{ item.tag }}: {{ item.count }}
            </span>
          </div>
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
            :class="{
              'time-block-clickable': entry.notes?.length,
              'time-block-constraint': getEntryType(entry) === 'constraint'
            }"
            :tabindex="entry.notes?.length ? 0 : undefined"
            :role="entry.notes?.length ? 'button' : undefined"
            @click="entry.notes?.length ? openNotes(entry as NoteEntry) : undefined"
            @keydown.enter="entry.notes?.length ? openNotes(entry as NoteEntry) : undefined"
            @keydown.space.prevent="entry.notes?.length ? openNotes(entry as NoteEntry) : undefined"
          >
            <div class="time-block-top">
              <span class="time-label">{{ entry.time }}</span>
              <span v-if="getEntryLabel(entry)" class="status-pill" :data-type="getEntryType(entry)">
                {{ getEntryLabel(entry) }}
              </span>
            </div>

            <strong class="session-label">{{ entry.session }}</strong>
            <span v-if="entry.detail" class="session-detail">{{ entry.detail }}</span>
            <div v-if="entry.tags?.length" class="session-tag-row">
              <span
                v-for="tag in entry.tags"
                :key="`${entry.date}-${entry.time}-${tag}`"
                class="session-tag-pill"
              >
                {{ tag }}
              </span>
            </div>
            <a
              v-if="entry.type === 'open'"
              :href="getWhatsappShareUrl(entry)"
              class="share-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share this training option on WhatsApp"
            >
              <svg class="share-link-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M19.05 4.94A9.77 9.77 0 0 0 12.09 2C6.66 2 2.23 6.39 2.23 11.81c0 1.74.46 3.43 1.34 4.92L2 22l5.42-1.51a9.87 9.87 0 0 0 4.67 1.19h.01c5.43 0 9.86-4.39 9.86-9.81a9.7 9.7 0 0 0-2.91-6.93Zm-6.96 15.08h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.21.9.86-3.12-.2-.32a8.1 8.1 0 0 1-1.25-4.34c0-4.5 3.71-8.16 8.27-8.16a8.2 8.2 0 0 1 5.86 2.43 8.04 8.04 0 0 1 2.42 5.73c0 4.5-3.71 8.16-8.27 8.16Zm4.48-6.12c-.24-.12-1.43-.7-1.66-.78-.22-.08-.38-.12-.54.12-.16.23-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.91-1.18-.7-.63-1.17-1.4-1.31-1.63-.14-.23-.01-.35.1-.47.1-.1.24-.27.36-.41.12-.14.16-.23.24-.39.08-.16.04-.29-.02-.41-.06-.12-.54-1.29-.74-1.77-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.41.06-.62.29-.22.23-.84.82-.84 2s.86 2.31.98 2.47c.12.16 1.69 2.68 4.16 3.65.59.25 1.05.39 1.41.5.59.18 1.13.16 1.55.1.47-.07 1.43-.58 1.64-1.13.2-.55.2-1.02.14-1.12-.05-.1-.2-.16-.44-.27Z" />
              </svg>
              Deel via WhatsApp
            </a>
            <span v-if="entry.notes?.length" class="notes-trigger">
              Bekijk notities
            </span>
          </div>
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
