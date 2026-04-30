<script setup lang="ts">
import { activeEvent } from '~/data/events'
import { campLogs } from '~/data/logbook'
import { scheduleWeeks, type ScheduleEntry } from '~/data/schedule'

const formatDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDurationMinutes = (time: string) => {
  if (!time.includes('-')) return 0

  const [start, end] = time.split('-')
  const [startHour, startMinute] = start.split(':').map(Number)
  const [endHour, endMinute] = end.split(':').map(Number)

  return ((endHour * 60) + endMinute) - ((startHour * 60) + startMinute)
}

const estimateMet = (entry: ScheduleEntry) => {
  if (entry.type !== 'training') return 0
  if (entry.session === 'PrepX') return 8
  if (entry.session === 'Conditioning') return 8.5
  if (entry.session === 'Sparren') return 9
  if (entry.session === 'Krachttraining' || entry.tags?.includes('Kracht')) return 6
  if (entry.session === 'Personal training') return 6
  if (entry.session.includes('Kickboksen') || entry.tags?.includes('Techniek')) return 7.5
  if (entry.tags?.includes('Conditie')) return 7
  return 6
}

const estimateTrainingCalories = (entry: ScheduleEntry, bodyWeightKg: number) => {
  const durationMinutes = parseDurationMinutes(entry.time)
  const met = estimateMet(entry)

  if (durationMinutes <= 0 || met <= 0) return 0
  return Math.round((met * 3.5 * bodyWeightKg / 200) * durationMinutes)
}

const getMacroTargets = (totalCalories: number, proteinGrams: number) => {
  const fatGrams = Math.round((totalCalories * 0.25) / 9)
  const remainingCalories = Math.max(0, totalCalories - (proteinGrams * 4) - (fatGrams * 9))
  const carbsGrams = Math.round(remainingCalories / 4)

  return {
    proteinGrams,
    carbsGrams,
    fatGrams
  }
}

const currentDate = new Date()
const todayKey = formatDateKey(currentDate)
const goalWeightKg = 95
const fallbackWeightKg = 86.8
const recommendedSurplusCalories = 300
const weightLogs = campLogs.filter((log) => Boolean(log.weightKg))
const currentWeightKg = [...weightLogs].reverse()[0]?.weightKg ?? fallbackWeightKg
const goalDate = new Date(`${activeEvent.date}T12:00:00`)
const daysUntilGoal = Math.max(1, Math.ceil((goalDate.getTime() - currentDate.getTime()) / 86400000))
const kilosRemaining = Math.max(0, goalWeightKg - currentWeightKg)

// Scientific estimate:
// 1) resting/day base from body mass: 24 kcal/kg/day
// 2) daily non-exercise multiplier 1.35
// 3) planned training energy via MET formula
const baseCaloriesWithoutTraining = Math.round(currentWeightKg * 24 * 1.35)
const proteinTargetGrams = Math.round(currentWeightKg * 1.8)
const aggressiveSurplusCalories = Math.round((kilosRemaining * 7700) / daysUntilGoal)
const baseGainCalories = baseCaloriesWithoutTraining + recommendedSurplusCalories

const scheduleEntries = scheduleWeeks
  .flatMap((week) => week.entries)
  .filter((entry) => entry.date >= todayKey && entry.date <= activeEvent.date)

const dayMap = scheduleEntries.reduce<Record<string, { date: string; dayLabel: string; entries: ScheduleEntry[] }>>((acc, entry) => {
  if (!acc[entry.date]) {
    acc[entry.date] = {
      date: entry.date,
      dayLabel: entry.dayLabel,
      entries: []
    }
  }

  acc[entry.date].entries.push(entry)
  return acc
}, {})

const dailyPlan = Object.values(dayMap)
  .map((day) => {
    const trainingCalories = day.entries.reduce((sum, entry) => sum + estimateTrainingCalories(entry, currentWeightKg), 0)
    const targetCalories = baseGainCalories + trainingCalories
    return {
      ...day,
      trainingCalories,
      targetCalories,
      macros: getMacroTargets(targetCalories, proteinTargetGrams)
    }
  })
  .sort((a, b) => a.date.localeCompare(b.date))

const todayPlan = dailyPlan.find((day) => day.date === todayKey)
const todayTargetCalories = todayPlan?.targetCalories ?? baseGainCalories
const todayTrainingCalories = todayPlan?.trainingCalories ?? 0
const todayMacros = getMacroTargets(todayTargetCalories, proteinTargetGrams)
const restDayMacros = getMacroTargets(baseGainCalories, proteinTargetGrams)
const eventDateTargetCalories = baseCaloriesWithoutTraining + aggressiveSurplusCalories + todayTrainingCalories
const eventDateMacros = getMacroTargets(eventDateTargetCalories, proteinTargetGrams)

const meals = [
  {
    title: 'Lunch',
    mealName: 'Pasta Chicken - Regular XXL Nutrition Fitmeals',
    calories: 603,
    fat: 20,
    carbs: 63.3,
    protein: 37
  }
] as const

const lunchShare = Math.round((meals[0].calories / todayTargetCalories) * 100)
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">Titan Training Camp</p>
      <h1>Voeding</h1>
      <p class="overview-intro">
        Schatting op basis van je huidige gewicht, trainingsbelasting in het kamp en een dagelijkse surplus voor gewichtstoename.
      </p>

      <div class="stats-row">
        <div class="stats-card">
          <strong>{{ currentWeightKg.toFixed(1) }} kg</strong>
          <span>huidig gewicht uit logboek</span>
        </div>
        <div class="stats-card">
          <strong>{{ goalWeightKg }} kg</strong>
          <span>doelgewicht richting {{ activeEvent.date }}</span>
        </div>
        <div class="stats-card">
          <strong>{{ todayTargetCalories }} kcal</strong>
          <span>doel voor vandaag inclusief training</span>
        </div>
      </div>
    </section>

    <section class="week-section">
      <div class="section-header">
        <div>
          <p class="section-kicker">Formule</p>
          <h2 class="week-title">Wetenschappelijke schatting</h2>
          <p class="week-range">Gebaseerd op lichaamsgewicht, MET-waarde per trainingstype en een dagelijkse surplus voor gewichtstoename.</p>
        </div>
      </div>

      <div class="day-grid">
        <article class="day-card training-example-card">
          <h3>Rustdag basis</h3>
          <div class="metric-row">
            <span class="metric-pill">{{ baseCaloriesWithoutTraining }} kcal basis</span>
            <span class="metric-pill">+{{ recommendedSurplusCalories }} kcal surplus</span>
            <span class="metric-pill">{{ baseGainCalories }} kcal rustdagdoel</span>
          </div>

          <div class="training-example-section">
            <p class="training-example-title">Macrodoel rustdag</p>
            <div class="metric-row">
              <span class="metric-pill">Eiwitten {{ restDayMacros.proteinGrams }} g</span>
              <span class="metric-pill">Koolhydraten {{ restDayMacros.carbsGrams }} g</span>
              <span class="metric-pill">Vetten {{ restDayMacros.fatGrams }} g</span>
            </div>
          </div>
        </article>

        <article class="day-card training-example-card">
          <h3>Vandaag</h3>
          <div class="metric-row">
            <span class="metric-pill">Trainingsverlies {{ todayTrainingCalories }} kcal</span>
            <span class="metric-pill">{{ todayTargetCalories }} kcal dagdoel</span>
          </div>

          <div class="training-example-section">
            <p class="training-example-title">Macrodoel vandaag</p>
            <div class="metric-row">
              <span class="metric-pill">Eiwitten {{ todayMacros.proteinGrams }} g</span>
              <span class="metric-pill">Koolhydraten {{ todayMacros.carbsGrams }} g</span>
              <span class="metric-pill">Vetten {{ todayMacros.fatGrams }} g</span>
            </div>
          </div>
        </article>

        <article class="day-card training-example-card">
          <h3>Camp-doel tempo</h3>
          <p class="event-summary">
            Om van {{ currentWeightKg.toFixed(1) }} kg naar {{ goalWeightKg }} kg te gaan in {{ daysUntilGoal }} dagen, is ongeveer
            {{ aggressiveSurplusCalories }} kcal extra per dag nodig. Dat is agressief; voor lean gain is {{ recommendedSurplusCalories }}
            kcal extra per dag realistischer.
          </p>

          <div class="training-example-section">
            <p class="training-example-title">Agressief dagdoel vandaag</p>
            <div class="metric-row">
              <span class="metric-pill">{{ eventDateTargetCalories }} kcal</span>
              <span class="metric-pill">Eiwitten {{ eventDateMacros.proteinGrams }} g</span>
              <span class="metric-pill">Koolhydraten {{ eventDateMacros.carbsGrams }} g</span>
              <span class="metric-pill">Vetten {{ eventDateMacros.fatGrams }} g</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="week-section">
      <div class="section-header">
        <div>
          <p class="section-kicker">Maaltijd</p>
          <h2 class="week-title">Voorbeeld lunch</h2>
          <p class="week-range">Eerste voorbeeldmaaltijd, afgezet tegen je doel voor vandaag.</p>
        </div>
      </div>

      <div class="day-grid">
        <article
          v-for="meal in meals"
          :key="meal.mealName"
          class="day-card training-example-card"
        >
          <span class="event-status-chip">{{ meal.title }}</span>
          <h3>{{ meal.mealName }}</h3>

          <div class="metric-row">
            <span class="metric-pill">Energie {{ meal.calories }} kcal</span>
            <span class="metric-pill">Vet {{ meal.fat }} g</span>
            <span class="metric-pill">Koolhydraten {{ meal.carbs }} g</span>
            <span class="metric-pill">Eiwitten {{ meal.protein }} g</span>
          </div>

          <div class="training-example-section">
            <p class="training-example-title">Plaats in je dagdoel</p>
            <div class="metric-row">
              <span class="metric-pill">{{ lunchShare }}% van vandaag</span>
              <span class="metric-pill">{{ todayTargetCalories - meal.calories }} kcal over</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="week-section">
      <div class="section-header">
        <div>
          <p class="section-kicker">Per Dag</p>
          <h2 class="week-title">Trainingsimpact op caloriebehoefte</h2>
          <p class="week-range">Per kampdag een schatting van trainingsverbruik en het bijbehorende eetdoel.</p>
        </div>
      </div>

      <div class="day-grid">
        <article
          v-for="day in dailyPlan"
          :key="day.date"
          class="day-card training-example-card"
        >
          <h3>{{ day.dayLabel }}</h3>

          <div class="metric-row">
            <span class="metric-pill">Trainingsverlies {{ day.trainingCalories }} kcal</span>
            <span class="metric-pill">Dagdoel {{ day.targetCalories }} kcal</span>
          </div>

          <div class="training-example-section">
            <p class="training-example-title">Sessies</p>
            <ul class="log-list">
              <li v-for="entry in day.entries" :key="`${entry.time}-${entry.session}`">
                {{ entry.time }} · {{ entry.session }}
              </li>
            </ul>
          </div>

          <div class="training-example-section">
            <p class="training-example-title">Macrodoel</p>
            <div class="metric-row">
              <span class="metric-pill">Eiwitten {{ day.macros.proteinGrams }} g</span>
              <span class="metric-pill">Koolhydraten {{ day.macros.carbsGrams }} g</span>
              <span class="metric-pill">Vetten {{ day.macros.fatGrams }} g</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
