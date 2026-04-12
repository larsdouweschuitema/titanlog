import { scheduleWeeks, type ScheduleWeek } from '~/data/schedule'

export type EventStatus = 'active' | 'upcoming'

export type FightEvent = {
  id: string
  name: string
  date: string
  organization: string
  location: string
  status: EventStatus
  summary: string
  weeks: ScheduleWeek[]
}

export const events: FightEvent[] = [
  {
    id: 'almere-finest',
    name: 'Almere’s Finest',
    date: '2026-06-07',
    organization: 'Almere’s Finest',
    location: 'Almere',
    status: 'active',
    summary: 'Huidig trainingskamp richting de wedstrijddag in Almere.',
    weeks: scheduleWeeks
  },
  {
    id: 'fightvalley-xl',
    name: 'FightValley XL',
    date: '2026-06-27',
    organization: 'FightValley XL',
    location: 'Nederland',
    status: 'upcoming',
    summary: 'Volgende event op de kalender na Almere’s Finest.',
    weeks: []
  }
]

export const getEventById = (id: string) => events.find((event) => event.id === id)
export const activeEvent = events.find((event) => event.status === 'active') ?? events[0]
