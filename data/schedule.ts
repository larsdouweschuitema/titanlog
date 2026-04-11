export type ScheduleType = 'training' | 'constraint' | 'optional' | 'event' | 'open'

export type Goal = {
  label: string
  date: string
  detail: string
}

export type ScheduleEntry = {
  date: string
  dayLabel: string
  time: string
  session: string
  type: ScheduleType
  notes?: string[]
}

export type ScheduleWeek = {
  title: string
  rangeLabel: string
  entries: ScheduleEntry[]
}

type WeekDefinition = {
  title: string
  rangeLabel: string
  weekStartDate: string
  includeMondayFightTeam?: boolean
  includeTuesdayOffice?: boolean
  includeTuesdayFightTeam?: boolean
  includeWednesdayFightTeam?: boolean
  includeThursdayFightTeam?: boolean
  includeFridayOffice?: boolean
  includeFridaySparring?: boolean
  extraEntries?: ScheduleEntry[]
}

export const goals: Goal[] = [
  { label: 'Almere’s Finest', date: '2026-06-07', detail: 'B-klasse partij' }
]

export const typeLabels: Record<ScheduleType, string> = {
  training: 'Aankomend',
  constraint: 'Bezet',
  optional: 'Optioneel',
  event: 'Event',
  open: 'Trainingsoptie'
}

const buildWeek = ({
  title,
  rangeLabel,
  weekStartDate,
  includeMondayFightTeam = false,
  includeTuesdayOffice = true,
  includeTuesdayFightTeam = false,
  includeWednesdayFightTeam = false,
  includeThursdayFightTeam = false,
  includeFridayOffice = true,
  includeFridaySparring = false,
  extraEntries = []
}: WeekDefinition): ScheduleWeek => {
  const start = new Date(`${weekStartDate}T12:00:00`)
  const defaults: ScheduleEntry[] = []
  const weekdayLabels = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']
  const monthLabels = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']

  const getDateForOffset = (daysFromStart: number) => {
    const date = new Date(start)
    date.setDate(date.getDate() + daysFromStart)
    return date.toISOString().slice(0, 10)
  }

  const getDayLabelForOffset = (daysFromStart: number) => {
    const date = new Date(start)
    date.setDate(date.getDate() + daysFromStart)
    return `${weekdayLabels[date.getDay()]} ${String(date.getDate()).padStart(2, '0')} ${monthLabels[date.getMonth()]}`
  }

  if (includeMondayFightTeam) {
    defaults.push({
      date: getDateForOffset(0),
      dayLabel: getDayLabelForOffset(0),
      time: '20:00-21:00',
      session: 'Wedstrijdgroep Kickboksen',
      type: 'training'
    })
  }

  if (includeTuesdayOffice) {
    defaults.push({
      date: getDateForOffset(1),
      dayLabel: getDayLabelForOffset(1),
      time: '09:00-17:00',
      session: 'Kantoordag',
      type: 'constraint'
    })
  }

  if (includeTuesdayFightTeam) {
    defaults.push({
      date: getDateForOffset(1),
      dayLabel: getDayLabelForOffset(1),
      time: '20:00-21:00',
      session: 'Wedstrijdgroep Kickboksen',
      type: 'training'
    })
  }

  if (includeWednesdayFightTeam) {
    defaults.push({
      date: getDateForOffset(2),
      dayLabel: getDayLabelForOffset(2),
      time: '19:30-21:00',
      session: 'Wedstrijdgroep Kickboksen',
      type: 'training'
    })
  }

  if (includeThursdayFightTeam) {
    defaults.push({
      date: getDateForOffset(3),
      dayLabel: getDayLabelForOffset(3),
      time: '20:00-21:00',
      session: 'Wedstrijdgroep Kickboksen',
      type: 'training'
    })
  }

  if (includeFridayOffice) {
    defaults.push({
      date: getDateForOffset(4),
      dayLabel: getDayLabelForOffset(4),
      time: '09:00-17:00',
      session: 'Kantoordag',
      type: 'constraint'
    })
  }

  if (includeFridaySparring) {
    defaults.push({
      date: getDateForOffset(4),
      dayLabel: getDayLabelForOffset(4),
      time: '19:00-20:30',
      session: 'Sparren',
      type: 'training'
    })
  }

  return {
    title,
    rangeLabel,
    entries: [...defaults, ...extraEntries]
  }
}

export const scheduleWeeks: ScheduleWeek[] = [
  buildWeek({
    title: 'Week 15',
    rangeLabel: 'ma 06 apr - zo 12 apr',
    weekStartDate: '2026-04-06',
    includeTuesdayFightTeam: false,
    includeThursdayFightTeam: false,
    includeFridaySparring: false,
    extraEntries: [
      {
        date: '2026-04-10',
        dayLabel: 'Vrijdag 10 apr',
        time: '19:00-20:30',
        session: 'Sparren',
        type: 'training'
      },
      {
        date: '2026-04-11',
        dayLabel: 'Zaterdag 11 apr',
        time: '08:45-10:00',
        session: 'PrepX',
        type: 'training',
        notes: [
          'Alles 4x 1min',
          'Back squats 50kg',
          'Ski jump-squads',
          'Slam ball 12kg',
          'Battle rope-Burpee',
          'Treadmill > Sprint',
          'Ketlebell 16kg overhead',
          'Hang clean and press 2.5 kg beide kant met stang'
        ]
      },
      {
        date: '2026-04-12',
        dayLabel: 'Zondag 12 apr',
        time: '12:00-13:00',
        session: '30+ Kickboksen',
        type: 'training'
      }
    ]
  }),
  buildWeek({
    title: 'Week 16',
    rangeLabel: 'ma 13 apr - zo 19 apr',
    weekStartDate: '2026-04-13',
    includeTuesdayFightTeam: true,
    includeWednesdayFightTeam: true,
    includeThursdayFightTeam: true,
    includeFridaySparring: true,
    extraEntries: [
      {
        date: '2026-04-13',
        dayLabel: 'Maandag 13 apr',
        time: 'Hele dag',
        session: 'Bezet',
        type: 'constraint'
      },
      {
        date: '2026-04-15',
        dayLabel: 'Woensdag 15 apr',
        time: '12:00-13:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      },
      {
        date: '2026-04-16',
        dayLabel: 'Donderdag 16 apr',
        time: '10:00-11:00',
        session: 'Personal training FitByTreff',
        type: 'training'
      }
    ]
  }),
  buildWeek({
    title: 'Week 17',
    rangeLabel: 'ma 20 apr - zo 26 apr',
    weekStartDate: '2026-04-20',
    includeThursdayFightTeam: true,
    includeFridaySparring: true
  }),
  buildWeek({
    title: 'Week 18',
    rangeLabel: 'ma 27 apr - zo 03 mei',
    weekStartDate: '2026-04-27',
    includeWednesdayFightTeam: true,
    includeThursdayFightTeam: true,
    includeFridaySparring: true
  }),
  buildWeek({
    title: 'Week 19',
    rangeLabel: 'ma 04 mei - zo 10 mei',
    weekStartDate: '2026-05-04',
    includeWednesdayFightTeam: true,
    includeThursdayFightTeam: true,
    includeFridaySparring: true
  }),
  buildWeek({
    title: 'Week 20',
    rangeLabel: 'ma 11 mei - zo 17 mei',
    weekStartDate: '2026-05-11',
    includeMondayFightTeam: true,
    includeTuesdayFightTeam: true,
    includeWednesdayFightTeam: true,
    includeThursdayFightTeam: true,
    includeFridaySparring: true,
    extraEntries: [
      {
        date: '2026-05-13',
        dayLabel: 'Woensdag 13 mei',
        time: '12:00-13:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      }
    ]
  }),
  buildWeek({
    title: 'Week 21',
    rangeLabel: 'ma 18 mei - zo 24 mei',
    weekStartDate: '2026-05-18',
    includeMondayFightTeam: true,
    includeTuesdayFightTeam: true,
    includeWednesdayFightTeam: true,
    includeThursdayFightTeam: true,
    includeFridaySparring: true,
    extraEntries: [
      {
        date: '2026-05-20',
        dayLabel: 'Woensdag 20 mei',
        time: '12:00-13:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      }
    ]
  }),
  buildWeek({
    title: 'Week 22',
    rangeLabel: 'ma 25 mei - zo 31 mei',
    weekStartDate: '2026-05-25',
    includeThursdayFightTeam: true,
    includeFridaySparring: true
  }),
  buildWeek({
    title: 'Week 23',
    rangeLabel: 'ma 01 jun - zo 07 jun',
    weekStartDate: '2026-06-01',
    includeWednesdayFightTeam: true,
    includeThursdayFightTeam: true,
    includeFridaySparring: true,
    extraEntries: [
      {
        date: '2026-06-07',
        dayLabel: 'Zondag 07 jun',
        time: 'Nog te bepalen',
        session: 'Almere’s Finest',
        type: 'event'
      }
    ]
  })
]
