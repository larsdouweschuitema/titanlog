import { scheduleWeeks, type ScheduleWeek } from '~/data/schedule'

export type EventStatus = 'active' | 'upcoming' | 'completed'

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

const archivedWeeks: ScheduleWeek[] = [
  {
    title: 'Week 4',
    rangeLabel: 'ma 20 jan - zo 26 jan',
    entries: [
      {
        date: '2026-01-21',
        dayLabel: 'Woensdag 21 jan',
        time: '19:30-21:00',
        session: 'Wedstrijdgroep Kickboksen',
        detail: 'Benito',
        type: 'training'
      },
      {
        date: '2026-01-24',
        dayLabel: 'Zaterdag 24 jan',
        time: '08:45-10:00',
        session: 'PrepX',
        detail: 'Treffel',
        type: 'training'
      }
    ]
  },
  {
    title: 'Week 5',
    rangeLabel: 'ma 27 jan - zo 02 feb',
    entries: [
      {
        date: '2026-01-28',
        dayLabel: 'Woensdag 28 jan',
        time: '12:00-13:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      },
      {
        date: '2026-01-30',
        dayLabel: 'Vrijdag 30 jan',
        time: '19:00-20:30',
        session: 'Sparren',
        detail: 'Treffel',
        type: 'training'
      }
    ]
  },
  {
    title: 'Fight Week',
    rangeLabel: 'ma 03 feb - zo 09 feb',
    entries: [
      {
        date: '2026-02-08',
        dayLabel: 'Zaterdag 08 feb',
        time: 'Hele dag',
        session: 'Weging',
        type: 'event'
      },
      {
        date: '2026-02-09',
        dayLabel: 'Zondag 09 feb',
        time: 'Hele dag',
        session: 'Amsterdam Fight Night',
        type: 'event'
      }
    ]
  }
]

const upcomingWeeks: ScheduleWeek[] = [
  {
    title: 'Week 1',
    rangeLabel: 'ma 15 jun - zo 21 jun',
    entries: [
      {
        date: '2026-06-17',
        dayLabel: 'Woensdag 17 jun',
        time: '19:30-21:00',
        session: 'Wedstrijdgroep Kickboksen',
        type: 'training'
      },
      {
        date: '2026-06-19',
        dayLabel: 'Vrijdag 19 jun',
        time: '19:00-20:30',
        session: 'Sparren',
        type: 'training'
      }
    ]
  },
  {
    title: 'Week 2',
    rangeLabel: 'ma 22 jun - zo 28 jun',
    entries: [
      {
        date: '2026-06-27',
        dayLabel: 'Zaterdag 27 jun',
        time: 'Hele dag',
        session: 'FightValley XL',
        type: 'event'
      }
    ]
  }
]

export const events: FightEvent[] = [
  {
    id: 'almere-finest',
    name: 'Almere’s Finest',
    date: '2026-06-07',
    organization: 'Almere’s Finest',
    location: 'Almere',
    status: 'active',
    summary: 'Current fight camp with weekly planning, bookable trainer slots, trainer notes, and event week.',
    weeks: scheduleWeeks
  },
  {
    id: 'fightvalley-xl',
    name: 'FightValley XL',
    date: '2026-06-27',
    organization: 'FightValley XL',
    location: 'Nederland',
    status: 'upcoming',
    summary: 'Upcoming event example with an early camp structure and a lighter pre-fight timeline.',
    weeks: upcomingWeeks
  },
  {
    id: 'amsterdam-fight-night',
    name: 'Amsterdam Fight Night',
    date: '2026-02-09',
    organization: 'Amsterdam Fight Night',
    location: 'Amsterdam',
    status: 'completed',
    summary: 'Archived camp example showing how past events can keep their own week numbers and event history.',
    weeks: archivedWeeks
  }
]

export const getEventById = (id: string) => events.find((event) => event.id === id)
export const activeEvent = events.find((event) => event.status === 'active') ?? events[0]
