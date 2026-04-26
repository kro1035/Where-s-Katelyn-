import { useState, useEffect, useRef } from 'react'

type ItemStatus = 'past' | 'current' | 'next' | 'future'

interface ScheduleItem {
  time: string
  minutes: number
  label: string
  details?: string
}

const weeklyFlow: Record<number, { name: string; focus: string[] }> = {
  0: { name: 'Sunday',    focus: ['Meal Prep', 'Laundry Day'] },
  1: { name: 'Monday',    focus: ['Living Arts Day', 'Clean House', 'Order Groceries (if needed)'] },
  2: { name: 'Tuesday',   focus: ['Library Day (10–10:45am)', 'Lunch with K2', 'Groceries & Errands'] },
  3: { name: 'Wednesday', focus: ['Baking Day', 'Meal Prep'] },
  4: { name: 'Thursday',  focus: ['Free Day'] },
  5: { name: 'Friday',    focus: ['Art Day'] },
  6: { name: 'Saturday',  focus: ['Park / Activity Morning', 'Rest Day'] },
}

const habits = [
  'Check YNAB before any purchase — discuss if money isn\'t available',
  'Make bed every morning',
  'Run dishwasher every night, unload every morning',
  'Make sure there is a meal ready',
  'Check off Sweepy, do tasks for 20 mins every evening',
  'No phones after 9pm',
]

const DAY_START = 360   // 6:00 AM
const DAY_END   = 1305  // 9:45 PM

function getSchedule(dayOfWeek: number): ScheduleItem[] {
  const isLessonDay = [1, 3, 5].includes(dayOfWeek)
  const isTuesday   = dayOfWeek === 2
  const focus0      = weeklyFlow[dayOfWeek]?.focus[0] ?? 'Planned Activity'

  return [
    { time: '6:00 AM', minutes: 360,  label: 'Wake Up',               details: 'Make bed, K1 get dressed' },
    { time: '6:10 AM', minutes: 370,  label: 'Morning Routine',        details: 'Coffee, check YNAB, start breakfast, unload dishes' },
    { time: '7:00 AM', minutes: 420,  label: 'Wake A2',                details: 'Diaper, 4oz bottle, day clothes' },
    { time: '7:15 AM', minutes: 435,  label: 'Breakfast',              details: 'Family breakfast' },
    { time: '7:30 AM', minutes: 450,  label: 'K2 Departs',             details: 'K1 prep morning activity' },
    { time: '7:45 AM', minutes: 465,  label: 'Play Outside',           details: 'Water garden' },
    { time: '8:15 AM', minutes: 495,  label: 'Morning Activity',       details: focus0 },
    { time: '9:00 AM', minutes: 540,  label: 'Books & Snack',          details: 'Read books, easy/low mess snack' },
    { time: '9:30 AM', minutes: 570,  label: 'A2 Nap + Free Space',    details: '15 min max scrolling — prep for Circle Time' },
    isTuesday
      ? { time: '10:00 AM', minutes: 600,  label: 'Library Day',       details: 'Library visit 10:00–10:45am' }
      : { time: '10:00 AM', minutes: 600,  label: 'Circle Time',       details: '' },
    isTuesday
      ? { time: '10:45 AM', minutes: 645,  label: 'Lunch with K2',     details: '' }
      : { time: '11:00 AM', minutes: 660,  label: 'Lunch',             details: '' },
    { time: '11:30 AM', minutes: 690,  label: isTuesday ? 'Groceries & Errands' : 'Free Play / Chores', details: '' },
    { time: '2:30 PM',  minutes: 870,  label: 'Nap Time',              details: '' },
    { time: '3:30 PM',  minutes: 930,  label: 'Free Space',            details: `15 min max scrolling — prep for ${isLessonDay ? 'Lesson' : 'afternoon'}` },
    { time: '4:00 PM',  minutes: 960,  label: isLessonDay ? 'Lesson' : 'TV Time', details: '4:00–4:30pm' },
    { time: '4:30 PM',  minutes: 990,  label: 'Snack',                 details: '' },
    { time: '4:45 PM',  minutes: 1005, label: 'Play Outside',          details: '4:45–5:30pm' },
    { time: '5:30 PM',  minutes: 1050, label: 'Dinner Prep',           details: 'A2 plays with K2, K1 preps dinner' },
    { time: '6:00 PM',  minutes: 1080, label: 'Dinner',                details: '' },
    { time: '6:30 PM',  minutes: 1110, label: 'A2 Bath',               details: 'A2 in bath by 6:30pm' },
    { time: '7:00 PM',  minutes: 1140, label: 'A2 Bedtime + Rest',     details: 'A2 in bed by 7pm, 10 min rest' },
    { time: '7:10 PM',  minutes: 1150, label: 'Sweepy',                details: 'Run Sweepy, 20 min tasks, run dishwasher' },
    { time: '7:35 PM',  minutes: 1175, label: 'Prep for Tomorrow',     details: 'K2: clothes, lunch, backpack  ·  K1: curriculum, lunch/dinner, scheduling' },
    { time: '7:55 PM',  minutes: 1195, label: 'Evening Wind Down',     details: 'Free time' },
    { time: '9:00 PM',  minutes: 1260, label: 'No Phone Screens',      details: 'Especially no scrolling' },
    { time: '9:45 PM',  minutes: 1305, label: 'In Bed',                details: 'Goodnight!' },
  ]
}

function formatMinutes(min: number): string {
  if (min === 1) return '1 min'
  return `${min} min`
}

function toTwoDigit(n: number) {
  return String(n).padStart(2, '0')
}

function formatTime(date: Date) {
  const h = date.getHours()
  const m = date.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${toTwoDigit(m)} ${ampm}`
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function SchedulePage() {
  const [now, setNow] = useState(() => new Date())
  const currentItemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    currentItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const dayOfWeek  = now.getDay()
  const currentMins = now.getHours() * 60 + now.getMinutes()
  const schedule   = getSchedule(dayOfWeek)
  const todayFlow  = weeklyFlow[dayOfWeek]

  let currentIdx = -1
  for (let i = 0; i < schedule.length; i++) {
    const end = schedule[i + 1]?.minutes ?? 1440
    if (currentMins >= schedule[i].minutes && currentMins < end) {
      currentIdx = i
      break
    }
  }

  const nextItem       = currentIdx >= 0 ? schedule[currentIdx + 1] : null
  const minsUntilNext  = nextItem ? nextItem.minutes - currentMins : null
  const progressPct    = Math.min(Math.max((currentMins - DAY_START) / (DAY_END - DAY_START) * 100, 0), 100)
  const beforeDay      = currentMins < DAY_START
  const afterDay       = currentMins >= DAY_END || (currentMins < DAY_START && now.getHours() < 6)

  function getStatus(index: number): ItemStatus {
    if (beforeDay) return 'future'
    const end = schedule[index + 1]?.minutes ?? 1440
    if (currentMins >= schedule[index].minutes && currentMins < end) return 'current'
    if (end <= currentMins) return 'past'
    if (index === currentIdx + 1) return 'next'
    return 'future'
  }

  return (
    <div className="min-h-full bg-slate-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 pt-4 pb-2 max-w-2xl mx-auto">
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{formatDate(now)}</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{formatTime(now)}</p>
            </div>
            <button
              onClick={() => setNow(new Date())}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          {/* Day progress bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>6:00 AM</span>
              <span className="text-slate-500 font-medium">{Math.round(progressPct)}% through the day</span>
              <span>9:45 PM</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">

        {/* Status banner */}
        <div className={`rounded-xl p-4 border ${
          afterDay
            ? 'bg-slate-800 border-slate-700'
            : beforeDay
            ? 'bg-indigo-600 border-indigo-500'
            : 'bg-amber-500 border-amber-400'
        }`}>
          {beforeDay || afterDay ? (
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                {beforeDay ? 'Before schedule' : 'End of day'}
              </p>
              <p className="text-lg font-bold">
                {beforeDay ? 'Wake up at 6:00 AM' : 'Well done — rest up!'}
              </p>
            </div>
          ) : (
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-75 mb-0.5">Currently</p>
              <p className="text-xl font-bold leading-tight">{schedule[currentIdx]?.label}</p>
              {schedule[currentIdx]?.details && (
                <p className="text-sm opacity-80 mt-0.5">{schedule[currentIdx].details}</p>
              )}
              {nextItem && minsUntilNext !== null && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-75 mb-0.5">Up Next</p>
                  <p className="text-sm font-semibold">
                    {nextItem.time} — {nextItem.label}
                    <span className="ml-2 font-normal opacity-75">in {formatMinutes(minsUntilNext)}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Today's focus */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Today's Focus</p>
          <p className="font-bold text-slate-900 text-base mb-2">{todayFlow.name}</p>
          <div className="flex flex-wrap gap-2">
            {todayFlow.focus.map(item => (
              <span
                key={item}
                className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Schedule timeline */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Daily Schedule</p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[4.75rem] top-3 bottom-3 w-px bg-slate-200" />

            <div className="space-y-0.5">
              {schedule.map((item, index) => {
                const status = getStatus(index)
                const isCurrent = status === 'current'
                const isNext    = status === 'next'
                const isPast    = status === 'past'

                return (
                  <div
                    key={index}
                    ref={isCurrent ? currentItemRef : undefined}
                    className={`relative flex items-start gap-0 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-amber-50 border border-amber-300 -mx-1 px-1 py-3'
                        : isNext
                        ? 'bg-blue-50 border border-blue-200 -mx-1 px-1 py-2'
                        : 'py-1.5'
                    }`}
                  >
                    {/* Time */}
                    <div className={`w-[4.5rem] flex-shrink-0 text-right pr-3 pt-0.5 text-xs font-semibold tabular-nums ${
                      isCurrent ? 'text-amber-600'
                      : isNext   ? 'text-blue-600'
                      : isPast   ? 'text-slate-300'
                      : 'text-slate-400'
                    }`}>
                      {item.time}
                    </div>

                    {/* Dot */}
                    <div className="flex-shrink-0 mt-1 relative z-10">
                      {isCurrent ? (
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                        </span>
                      ) : (
                        <span className={`inline-flex rounded-full h-3 w-3 ${
                          isNext ? 'bg-blue-400'
                          : isPast ? 'bg-slate-200'
                          : 'bg-slate-300'
                        }`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pl-4">
                      <p className={`text-sm font-semibold leading-snug ${
                        isCurrent ? 'text-amber-900'
                        : isNext   ? 'text-blue-900'
                        : isPast   ? 'text-slate-300 line-through decoration-slate-200'
                        : 'text-slate-700'
                      }`}>
                        {item.label}
                      </p>
                      {item.details && (
                        <p className={`text-xs mt-0.5 leading-snug ${
                          isCurrent ? 'text-amber-700'
                          : isNext   ? 'text-blue-600'
                          : isPast   ? 'text-slate-300'
                          : 'text-slate-400'
                        }`}>
                          {item.details}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Daily habits */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Daily Habits</p>
          <ul className="space-y-2">
            {habits.map(habit => (
              <li key={habit} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                {habit}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-xs text-slate-300 pb-4">Updates every 30 seconds</p>
      </div>
    </div>
  )
}
