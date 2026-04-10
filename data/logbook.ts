export type MealSlot = 'ontbijt' | 'lunch' | 'diner' | 'snacks'

export type MacroTotals = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type MealEntry = {
  label: string
  items: string[]
  macros: MacroTotals
}

export type DailyLog = {
  date: string
  dayLabel: string
  weekTitle: string
  meals: Partial<Record<MealSlot, MealEntry>>
  sleepHours?: number
  weightKg?: number
  bodyFatPercentage?: number
}

const campStart = new Date('2026-04-10T12:00:00')
const campEnd = new Date('2026-06-07T12:00:00')

const seedLogs: Record<string, Omit<DailyLog, 'date' | 'dayLabel' | 'weekTitle'>> = {}

const dayFormatter = new Intl.DateTimeFormat('nl-NL', {
  weekday: 'long',
  day: '2-digit',
  month: 'short'
})

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const getWeekTitle = (date: Date) => {
  const januaryFourth = new Date(date.getFullYear(), 0, 4)
  const januaryFourthDay = (januaryFourth.getDay() + 6) % 7
  januaryFourth.setDate(januaryFourth.getDate() - januaryFourthDay + 3)

  const target = new Date(date)
  const dayNr = (target.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)

  const weekNumber = 1 + Math.round((target.getTime() - januaryFourth.getTime()) / 604800000)
  return `Week ${weekNumber}`
}

export const getDailyTotals = (log: DailyLog): MacroTotals =>
  Object.values(log.meals).reduce<MacroTotals>(
    (acc, meal) => ({
      calories: acc.calories + (meal?.macros.calories ?? 0),
      protein: acc.protein + (meal?.macros.protein ?? 0),
      carbs: acc.carbs + (meal?.macros.carbs ?? 0),
      fat: acc.fat + (meal?.macros.fat ?? 0)
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

export const campLogs: DailyLog[] = (() => {
  const days: DailyLog[] = []

  for (const cursor = new Date(campStart); cursor <= campEnd; cursor.setDate(cursor.getDate() + 1)) {
    const date = cursor.toISOString().slice(0, 10)
    const seeded = seedLogs[date]

    days.push({
      date,
      dayLabel: capitalize(dayFormatter.format(cursor)),
      weekTitle: getWeekTitle(cursor),
      meals: seeded?.meals ?? {},
      sleepHours: seeded?.sleepHours,
      weightKg: seeded?.weightKg,
      bodyFatPercentage: seeded?.bodyFatPercentage
    })
  }

  return days
})()
