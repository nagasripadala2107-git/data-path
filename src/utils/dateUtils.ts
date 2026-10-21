/**
 * Local date and streak calculation utilities
 * Strictly avoids UTC conversion bugs by using the browser's local calendar dates.
 */

/**
 * Returns a 'YYYY-MM-DD' formatted string based on local time.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses 'YYYY-MM-DD' into a local Date object set at 00:00:00 local time.
 */
export function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Gets previous day date string in local time.
 */
export function getPreviousDateString(dateStr: string, daysAgo: number = 1): string {
  const d = parseLocalDateString(dateStr);
  d.setDate(d.getDate() - daysAgo);
  return getLocalDateString(d);
}

/**
 * Gets next day date string in local time.
 */
export function getNextDateString(dateStr: string, daysForward: number = 1): string {
  const d = parseLocalDateString(dateStr);
  d.setDate(d.getDate() + daysForward);
  return getLocalDateString(d);
}

/**
 * Friendly date formatter (e.g. "Wednesday, Oct 21, 2026")
 */
export function formatFriendlyDate(dateStr: string): string {
  try {
    const d = parseLocalDateString(dateStr);
    return d.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Short date formatter (e.g. "Oct 21")
 */
export function formatShortDate(dateStr: string): string {
  try {
    const d = parseLocalDateString(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Formats seconds into HH:MM:SS or MM:SS
 */
export function formatDuration(totalSeconds: number, alwaysShowHours: boolean = false): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (hours > 0 || alwaysShowHours) {
    const hh = String(hours).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Formats minutes into human-readable e.g. "1h 15m" or "45m"
 */
export function formatMinutesHuman(totalMinutes: number): string {
  const rounded = Math.round(totalMinutes);
  if (rounded <= 0) return '0m';
  const hours = Math.floor(rounded / 60);
  const mins = rounded % 60;
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
}

export interface SplitSessionResult {
  date: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
}

/**
 * Handles sessions that cross midnight.
 * Splits a timestamp interval [startTime, endTime] into discrete day segments
 * allocated to their respective local calendar dates.
 */
export function splitSessionAcrossMidnight(
  startTime: number,
  endTime: number
): SplitSessionResult[] {
  if (endTime <= startTime) return [];

  const results: SplitSessionResult[] = [];
  let currentStart = startTime;

  while (currentStart < endTime) {
    const startDate = new Date(currentStart);
    // Midnight at end of startDate in local time
    const nextMidnight = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + 1,
      0,
      0,
      0,
      0
    ).getTime();

    const currentEnd = Math.min(endTime, nextMidnight);
    const durationSeconds = Math.max(1, Math.round((currentEnd - currentStart) / 1000));
    const dateStr = getLocalDateString(startDate);

    results.push({
      date: dateStr,
      startTime: currentStart,
      endTime: currentEnd,
      durationSeconds,
    });

    currentStart = nextMidnight;
  }

  return results;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalQualifyingDays: number;
  todayMinutes: number;
  todayGoalMet: boolean;
  qualifyingDatesSet: Set<string>;
  dailyMinutesMap: Record<string, number>;
}

/**
 * Calculates streaks and qualifying dates based on actual recorded session minutes.
 * A day qualifies if and only if total minutes for that local date >= goalMinutes (default 60).
 */
export function calculateStreakStats(
  sessions: Array<{ date: string; durationMinutes: number; durationSeconds?: number }>,
  goalMinutes: number = 60
): StreakStats {
  // Aggregate minutes by local date
  const dailyMinutesMap: Record<string, number> = {};

  for (const session of sessions) {
    const minutes =
      typeof session.durationMinutes === 'number'
        ? session.durationMinutes
        : (session.durationSeconds || 0) / 60;
    dailyMinutesMap[session.date] = (dailyMinutesMap[session.date] || 0) + minutes;
  }

  const qualifyingDatesSet = new Set<string>();
  for (const [dateStr, minutes] of Object.entries(dailyMinutesMap)) {
    // Only qualifying if at least goalMinutes (60)
    if (Math.round(minutes) >= goalMinutes) {
      qualifyingDatesSet.add(dateStr);
    }
  }

  const todayStr = getLocalDateString();
  const yesterdayStr = getPreviousDateString(todayStr, 1);
  const todayMinutes = dailyMinutesMap[todayStr] || 0;
  const todayGoalMet = Math.round(todayMinutes) >= goalMinutes;

  // Calculate current streak
  let currentStreak = 0;
  if (qualifyingDatesSet.has(todayStr)) {
    // Goal reached today, count backwards starting from today
    let checkDate = todayStr;
    while (qualifyingDatesSet.has(checkDate)) {
      currentStreak += 1;
      checkDate = getPreviousDateString(checkDate, 1);
    }
  } else if (qualifyingDatesSet.has(yesterdayStr)) {
    // Goal not yet reached today, but yesterday was completed.
    // Preserve active streak!
    let checkDate = yesterdayStr;
    while (qualifyingDatesSet.has(checkDate)) {
      currentStreak += 1;
      checkDate = getPreviousDateString(checkDate, 1);
    }
  } else {
    // Yesterday was not completed and today not completed -> 0 streak
    currentStreak = 0;
  }

  // Calculate longest streak across history
  const sortedDates = Array.from(qualifyingDatesSet).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: string | null = null;

  for (const dStr of sortedDates) {
    if (!lastDate) {
      tempStreak = 1;
    } else {
      const expectedNext = getNextDateString(lastDate, 1);
      if (dStr === expectedNext) {
        tempStreak += 1;
      } else {
        tempStreak = 1;
      }
    }
    lastDate = dStr;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalQualifyingDays: qualifyingDatesSet.size,
    todayMinutes,
    todayGoalMet,
    qualifyingDatesSet,
    dailyMinutesMap,
  };
}

/**
 * Returns month calendar grid days for a given year and month (0-indexed).
 */
export function getMonthDaysGrid(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const totalDays = lastDayOfMonth.getDate();

  const days: Array<{
    dateStr: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    dateObj: Date;
  }> = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      dateStr: getLocalDateString(d),
      dayNumber: prevMonthLastDay - i,
      isCurrentMonth: false,
      dateObj: d,
    });
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    days.push({
      dateStr: getLocalDateString(d),
      dayNumber: day,
      isCurrentMonth: true,
      dateObj: d,
    });
  }

  // Next month leading days to fill complete weeks (multiples of 7)
  const remaining = (7 - (days.length % 7)) % 7;
  for (let day = 1; day <= remaining; day++) {
    const d = new Date(year, month + 1, day);
    days.push({
      dateStr: getLocalDateString(d),
      dayNumber: day,
      isCurrentMonth: false,
      dateObj: d,
    });
  }

  return days;
}
