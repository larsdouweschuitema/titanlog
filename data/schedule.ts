export type ScheduleType = 'training' | 'constraint' | 'optional' | 'event' | 'open'
export type TrainingTag = 'Conditie' | 'Kracht' | 'Techniek' | 'Sparren'

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
  detail?: string
  type: ScheduleType
  completed?: boolean
  tags?: TrainingTag[]
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
      tags: ['Techniek'],
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
      detail: 'Benito',
      tags: ['Techniek'],
      type: 'training'
    })
  }

  if (includeWednesdayFightTeam) {
    defaults.push({
      date: getDateForOffset(2),
      dayLabel: getDayLabelForOffset(2),
      time: '19:30-21:00',
      session: 'Wedstrijdgroep Kickboksen',
      tags: ['Techniek'],
      type: 'training'
    })
  }

  if (includeThursdayFightTeam) {
    defaults.push({
      date: getDateForOffset(3),
      dayLabel: getDayLabelForOffset(3),
      time: '20:00-21:00',
      session: 'Wedstrijdgroep Kickboksen',
      detail: 'Benito',
      tags: ['Techniek'],
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
      tags: ['Sparren'],
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
        detail: 'Treffel',
        tags: ['Sparren'],
        type: 'training',
        notes: [
          'Iets later ingestroomd rond 19:15 door een misverstand over de begintijd, waardoor ik een deel van de warming-up heb gemist.',
          'Gestart met vijf boksrondes.',
          'Aanvankelijk richting het hoofd gespard ondanks mijn gevoelige neus; in de tweede ronde direct een bloedneus gekregen, waarna ik alleen nog op het lichaam heb gespard.',
          'Verder technisch gespard, met iets meer intensiteit op het lichaam.',
          'Afgesloten met 200 buikspieroefeningen in verschillende vormen, 25 herhalingen per persoon.',
          'Tot slot kort gerekt en gestrekt.'
        ]
      },
      {
        date: '2026-04-11',
        dayLabel: 'Zaterdag 11 apr',
        time: '08:45-10:00',
        session: 'PrepX',
        detail: 'Treffel',
        tags: ['Conditie', 'Kracht'],
        type: 'training',
        notes: [
          'Alle onderdelen uitgevoerd in blokken van 4 keer 1 minuut.',
          'Back squats op 50 kg.',
          'Ski jump squats.',
          'Slam ball op 12 kg.',
          'Battle rope gecombineerd met burpees.',
          'Treadmill met sprintintervallen.',
          'Overhead kettlebell work op 16 kg.',
          'Hang clean and press met stang en 2,5 kg per kant.'
        ]
      },
      {
        date: '2026-04-12',
        dayLabel: 'Zondag 12 apr',
        time: '12:00-13:00',
        session: '30+ Kickboksen',
        detail: 'Gerven + Charles',
        tags: ['Techniek', 'Sparren'],
        type: 'training',
        notes: [
          'Warming-up met lopen op de plaats, stoten naar voren en omhoog, knieën, oplopende sprints en schaduwboksen met push-ups, squats en sit-ups op commando.',
          'Links/rechts combinaties over en weer op tempo.',
          'Links/rechts gevolgd door slip, counterjab, hoek en linker low kick.',
          'Links/rechts gevolgd door linkerknie met actieve handpositie en daarna rechterknie met handverplaatsing.',
          'Counterstoot ontwijken en uitstappen naar links met schouderrotatie.',
          'Afsluitend 20 minuten sparren op het lichaam vanwege herstel van mijn gebroken neus.'
        ]
      }
    ]
  }),
  buildWeek({
    title: 'Week 16',
    rangeLabel: 'ma 13 apr - zo 19 apr',
    weekStartDate: '2026-04-13',
    includeFridaySparring: false,
    extraEntries: [
      {
        date: '2026-04-13',
        dayLabel: 'Maandag 13 apr',
        time: 'Hele dag',
        session: 'Bezet',
        type: 'constraint'
      },
      {
        date: '2026-04-14',
        dayLabel: 'Dinsdag 14 apr',
        time: 'Hele dag',
        session: 'Bezet',
        type: 'constraint'
      },
      {
        date: '2026-04-15',
        dayLabel: 'Woensdag 15 apr',
        time: '19:30-21:00',
        session: 'Wedstrijdgroep Kickboksen',
        tags: ['Techniek'],
        type: 'training',
        notes: [
          'Warming-up met directe stoten, opstoten en lichaamstrappen, gevolgd door tempowisselingen in duo.',
          'Technische combinaties eerst rustig opgebouwd en daarna in blokken van 30 herhalingen op tel van de trainer uitgevoerd.',
          'Extra rondes met jab-directe door het midden en direct-hoek om timing en zuiverheid aan te scherpen.',
          'Combinatie: jab, jab low kick, direct, opstoot, hoek, low kick.',
          'Combinatie: jab, switch right body kick, directe, hoek, switch right body kick.',
          'Combinatie: links, rechts, hoek, leverstoot, knie.',
          'Afgesloten met 2 minuten duo-werk op de buik en links-rechts aanspelen.',
          'Core-finisher met 1 minuut knipscharen en 1 minuut statische buikspanning met gecontroleerde op-en-neer bewegingen.'
        ]
      },
      {
        date: '2026-04-16',
        dayLabel: 'Donderdag 16 apr',
        time: '20:00-21:00',
        session: 'Wedstrijdgroep Kickboksen',
        detail: 'Treffel',
        tags: ['Techniek'],
        type: 'training'
      },
      {
        date: '2026-04-16',
        dayLabel: 'Donderdag 16 apr',
        time: '10:00-11:00',
        session: 'Personal training',
        detail: 'Treffel',
        completed: true,
        tags: ['Conditie', 'Kracht'],
        type: 'training',
        notes: [
          'Barbell bench press met 2 x 10 kg plus stang: 10 reguliere herhalingen, gevolgd door 10 herhalingen met per rep een korte press en daarna een volledige lock-out.',
          'Barbell bench press met 2 x 5 kg plus stang in tempowerk: explosief omhoog, daarna 3 seconden gecontroleerd laten zakken en direct opnieuw uitstoten.',
          'Cable punch drill op 15 kg met jab-directe combinaties voor kracht en explosiviteit.'
        ]
      },
      {
        date: '2026-04-17',
        dayLabel: 'Vrijdag 17 apr',
        time: '19:00-20:30',
        session: 'Sparren',
        detail: 'Treffel',
        completed: true,
        tags: ['Sparren'],
        type: 'training',
        notes: [
          'Warming-up met 2 rondes van 3 minuten schaduwboksen.',
          'Daarna 3 minuten mobiliteit en dynamisch rekken.',
          'Vervolgens 5 rondes bokssparren.',
          'Aansluitend 7 rondes kickbokssparren.',
          'Afgesloten met 5 minuten uitlopen, rekken en strekken.'
        ]
      },
      {
        date: '2026-04-18',
        dayLabel: 'Zaterdag 18 apr',
        time: '08:45-10:00',
        session: 'PrepX',
        detail: 'Treffel',
        completed: true,
        tags: ['Conditie', 'Kracht'],
        type: 'training',
        notes: [
          'Warming-up met één groot rondje hardlopen.',
          'Daarna een circuittraining waarbij elk onderdeel 6 minuten duurde, in intervallen van 30 seconden werk en 30 seconden rust.',
          'Na elk blok van 6 minuten volgde opnieuw een hardloopronde.',
          'Onderdelen: roeien, wall balls met 9 kg, prowler sled push met 125 kg, thrusters met 30 kg en ski-erg op niveau 5.'
        ]
      },
      {
        date: '2026-04-19',
        dayLabel: 'Zondag 19 apr',
        time: '12:00-13:00',
        session: '30+ Kickboksen',
        completed: true,
        tags: ['Sparren'],
        type: 'training',
        notes: [
          'De volledige training bestond uit een uur sparren, zonder techniekblok.',
          'We begonnen met 2 rondes zelfstandig schaduwboksen als warming-up.',
          'Daarna volgden 2 rondes benen tikken met de handen om afstand, timing en reacties te activeren.',
          'Vervolgens 5 rondes bokssparren.',
          'Daarna 1 ronde van 3 minuten waarbij steeds 1 minuut de ene deelnemer alleen bokste en de andere alleen trapte; in de laatste minuut werkte iedereen compleet.',
          'Aansluitend meerdere rondes bokssparren van 3 minuten, waarbij telkens 1 deelnemer alleen met de jab-hand werkte en de ander beide handen gebruikte; in de laatste minuut werd er volledig gebokst.',
          'De laatste rondes werden volledig kickboksend uitgespart.',
          'Afgesloten met een rustige cooling-down in de vorm van een ontspannen ronde schaduwboksen.'
        ]
      }
    ]
  }),
  buildWeek({
    title: 'Week 17',
    rangeLabel: 'ma 20 apr - zo 26 apr',
    weekStartDate: '2026-04-20',
    includeTuesdayFightTeam: true,
    includeWednesdayFightTeam: false,
    includeThursdayFightTeam: true,
    includeFridaySparring: true,
    extraEntries: [
      {
        date: '2026-04-20',
        dayLabel: 'Maandag 20 apr',
        time: 'Hele dag',
        session: 'Bezet',
        type: 'constraint'
      },
      {
        date: '2026-04-22',
        dayLabel: 'Woensdag 22 apr',
        time: 'Hele dag',
        session: 'Ziek, geen training',
        detail: 'Op 22 april was ik ziek, dus de training ging niet door.',
        type: 'constraint'
      },
      {
        date: '2026-04-23',
        dayLabel: 'Donderdag 23 apr',
        time: '12:00-14:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      },
      {
        date: '2026-04-25',
        dayLabel: 'Zaterdag 25 apr',
        time: '08:45-10:00',
        session: 'PrepX',
        tags: ['Conditie', 'Kracht'],
        type: 'training'
      },
      {
        date: '2026-04-26',
        dayLabel: 'Zondag 26 apr',
        time: 'Hele dag',
        session: 'Bezet',
        type: 'constraint'
      }
    ]
  }),
  buildWeek({
    title: 'Week 18',
    rangeLabel: 'ma 27 apr - zo 03 mei',
    weekStartDate: '2026-04-27',
    includeWednesdayFightTeam: true,
    includeThursdayFightTeam: true,
    includeFridaySparring: true,
    extraEntries: [
      {
        date: '2026-04-29',
        dayLabel: 'Woensdag 29 apr',
        time: '11:00-14:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      },
      {
        date: '2026-04-30',
        dayLabel: 'Donderdag 30 apr',
        time: '11:00-14:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      }
    ]
  }),
  buildWeek({
    title: 'Week 19',
    rangeLabel: 'ma 04 mei - zo 10 mei',
    weekStartDate: '2026-05-04',
    includeWednesdayFightTeam: true,
    includeThursdayFightTeam: true,
    includeFridaySparring: true,
    extraEntries: [
      {
        date: '2026-05-06',
        dayLabel: 'Woensdag 06 mei',
        time: '12:00-14:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      },
      {
        date: '2026-05-07',
        dayLabel: 'Donderdag 07 mei',
        time: '12:00-14:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      }
    ]
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
      },
      {
        date: '2026-05-14',
        dayLabel: 'Donderdag 14 mei',
        time: '10:00-14:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      },
      {
        date: '2026-05-16',
        dayLabel: 'Zaterdag 16 mei',
        time: '08:45-10:00',
        session: 'PrepX',
        tags: ['Conditie', 'Kracht'],
        type: 'training'
      },
      {
        date: '2026-05-17',
        dayLabel: 'Zondag 17 mei',
        time: '12:00-13:00',
        session: '30+ Kickboksen',
        tags: ['Techniek', 'Sparren'],
        type: 'training'
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
        time: '12:00-14:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      },
      {
        date: '2026-05-21',
        dayLabel: 'Donderdag 21 mei',
        time: '12:00-14:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      },
      {
        date: '2026-05-23',
        dayLabel: 'Zaterdag 23 mei',
        time: '08:45-10:00',
        session: 'PrepX',
        tags: ['Conditie', 'Kracht'],
        type: 'training'
      },
      {
        date: '2026-05-24',
        dayLabel: 'Zondag 24 mei',
        time: '12:00-13:00',
        session: '30+ Kickboksen',
        tags: ['Techniek', 'Sparren'],
        type: 'training'
      }
    ]
  }),
  buildWeek({
    title: 'Week 22',
    rangeLabel: 'ma 25 mei - zo 31 mei',
    weekStartDate: '2026-05-25',
    includeThursdayFightTeam: true,
    includeFridaySparring: true,
    extraEntries: [
      {
        date: '2026-05-27',
        dayLabel: 'Woensdag 27 mei',
        time: '10:00-14:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      },
      {
        date: '2026-05-28',
        dayLabel: 'Donderdag 28 mei',
        time: '12:00-14:00',
        session: 'Boekbare trainingsoptie',
        type: 'open'
      },
      {
        date: '2026-05-30',
        dayLabel: 'Zaterdag 30 mei',
        time: '08:45-10:00',
        session: 'PrepX',
        tags: ['Conditie', 'Kracht'],
        type: 'training'
      },
      {
        date: '2026-05-31',
        dayLabel: 'Zondag 31 mei',
        time: '12:00-13:00',
        session: '30+ Kickboksen',
        tags: ['Techniek', 'Sparren'],
        type: 'training'
      }
    ]
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
        date: '2026-06-06',
        dayLabel: 'Zaterdag 06 jun',
        time: 'Hele dag',
        session: 'Weging',
        type: 'event'
      },
      {
        date: '2026-06-07',
        dayLabel: 'Zondag 07 jun',
        time: 'Hele dag',
        session: 'Almere’s Finest',
        type: 'event'
      }
    ]
  })
]
