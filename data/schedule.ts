export type ScheduleType = 'training' | 'constraint' | 'optional' | 'event'

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
  includeTuesdayBlock?: boolean
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
  event: 'Event'
}

const buildWeek = ({
  title,
  rangeLabel,
  weekStartDate,
  includeTuesdayBlock = true,
  includeThursdayFightTeam = true,
  includeFridayOffice = true,
  includeFridaySparring = true,
  extraEntries = []
}: WeekDefinition): ScheduleWeek => {
  const start = new Date(`${weekStartDate}T12:00:00`)
  const defaults: ScheduleEntry[] = []

  const getDateForOffset = (daysFromStart: number) => {
    const date = new Date(start)
    date.setDate(date.getDate() + daysFromStart)
    return date.toISOString().slice(0, 10)
  }

  if (includeTuesdayBlock) {
    defaults.push({
      date: getDateForOffset(3),
      dayLabel: 'Dinsdag',
      time: 'Hele dag',
      session: 'Werk + kinderen',
      type: 'constraint'
    })
  }

  if (includeThursdayFightTeam) {
    defaults.push({
      date: getDateForOffset(5),
      dayLabel: 'Donderdag',
      time: '20:00-21:00',
      session: 'Wedstrijdgroep Kickboksen',
      type: 'training'
    })
  }

  if (includeFridayOffice) {
    defaults.push({
      date: getDateForOffset(6),
      dayLabel: 'Vrijdag',
      time: '09:00-17:00',
      session: 'Kantoordag',
      type: 'constraint'
    })
  }

  if (includeFridaySparring) {
    defaults.push({
      date: getDateForOffset(6),
      dayLabel: 'Vrijdag',
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
    rangeLabel: 'vr 10 apr - vr 17 apr',
    weekStartDate: '2026-04-11',
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
        type: 'training'
      },
      {
        date: '2026-04-12',
        dayLabel: 'Zondag 12 apr',
        time: '12:00-13:00',
        session: '30+ Kickboksen',
        type: 'training'
      },
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
        time: '19:30-21:00',
        session: 'Wedstrijdgroep Kickboksen',
        type: 'training'
      },
      {
        date: '2026-04-16',
        dayLabel: 'Donderdag 16 apr',
        time: '10:00-11:00',
        session: 'Power & Condition with Sensei Treffel',
        type: 'training'
      }
    ]
  }),
  buildWeek({
    title: 'Week 16',
    rangeLabel: 'za 18 apr - vr 24 apr',
    weekStartDate: '2026-04-18'
  }),
  buildWeek({
    title: 'Week 17',
    rangeLabel: 'za 25 apr - vr 01 mei',
    weekStartDate: '2026-04-25'
  }),
  buildWeek({
    title: 'Week 18',
    rangeLabel: 'za 02 mei - vr 08 mei',
    weekStartDate: '2026-05-02'
  }),
  buildWeek({
    title: 'Week 19',
    rangeLabel: 'za 09 mei - vr 15 mei',
    weekStartDate: '2026-05-09'
  }),
  buildWeek({
    title: 'Week 20',
    rangeLabel: 'za 16 mei - vr 22 mei',
    weekStartDate: '2026-05-16'
  }),
  buildWeek({
    title: 'Week 21',
    rangeLabel: 'za 23 mei - vr 29 mei',
    weekStartDate: '2026-05-23'
  }),
  buildWeek({
    title: 'Week 22',
    rangeLabel: 'za 30 mei - vr 05 jun',
    weekStartDate: '2026-05-30'
  }),
  buildWeek({
    title: 'Week 23',
    rangeLabel: 'za 06 jun - zo 07 jun',
    weekStartDate: '2026-06-06',
    includeTuesdayBlock: false,
    includeThursdayFightTeam: false,
    includeFridayOffice: false,
    includeFridaySparring: false,
    extraEntries: [
      {
        date: '2026-06-06',
        dayLabel: 'Zaterdag 06 jun',
        time: 'Nog te bepalen',
        session: 'Lichte activatie / rust',
        type: 'optional'
      },
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
