import React, { useState } from 'react';
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  Award,
  CheckCircle2,
  Calendar as CalendarIcon,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getMonthDaysGrid,
  getLocalDateString,
  formatFriendlyDate,
  formatMinutesHuman,
} from '../../utils/dateUtils';

export const StreakCalendarView: React.FC = () => {
  const { streakStats, userProfile, sessions, setCurrentTab } = useApp();

  const todayStr = getLocalDateString();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthName = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const daysGrid = getMonthDaysGrid(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  const milestones = [
    { days: 3, label: '3-Day Consistency Spark', desc: 'First unbroken 3-day study sprint' },
    { days: 7, label: '7-Day Data Warrior', desc: 'A full week of 60m+ daily learning' },
    { days: 14, label: '14-Day Pipeline Master', desc: 'Two consecutive weeks of dedication' },
    { days: 30, label: '30-Day Engineering Habit', desc: 'Rock-solid daily data engineering routine' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Streak Stats */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Flame className="h-4 w-4 fill-current" />
              <span>Consistency & Momentum Tracker</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Streak Calendar
            </h1>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Earn a qualifying day by studying for at least 60 minutes on any calendar date.
            </p>
          </div>

          {/* Today's Streak Badge */}
          <div className="flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Flame className="h-7 w-7 fill-current" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                Current Streak
              </div>
              <div className="font-mono text-2xl font-bold tabular-nums text-amber-950 dark:text-amber-100">
                {streakStats.currentStreak} <span className="text-sm font-medium">Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-xs text-slate-500 dark:text-slate-400">Longest Streak</span>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
              {streakStats.longestStreak} days
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Historical personal best</span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Qualifying Days</span>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
              {streakStats.totalQualifyingDays} days
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Days with ≥ 60 study minutes</span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-xs text-slate-500 dark:text-slate-400">Today's Status</span>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
              <span>{Math.round(streakStats.todayMinutes)}m</span>
              {streakStats.todayGoalMet ? (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">(Qualified)</span>
              ) : (
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ 60m</span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {streakStats.todayGoalMet ? 'Goal reached for today!' : 'Active streak preserved today'}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Grid Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {monthName}
            </h2>
            <button
              type="button"
              onClick={jumpToToday}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Day of Week Labels */}
        <div className="mt-4 grid grid-cols-7 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
          {daysGrid.map((day) => {
            const isToday = day.dateStr === todayStr;
            const isFuture = day.dateStr > todayStr;
            const isQualifying = streakStats.qualifyingDatesSet.has(day.dateStr);
            const recordedMinutes = streakStats.dailyMinutesMap[day.dateStr] || 0;

            return (
              <div
                key={day.dateStr}
                className={`relative flex min-h-[70px] sm:min-h-[85px] flex-col justify-between rounded-xl p-2 border transition-colors ${
                  !day.isCurrentMonth
                    ? 'border-transparent bg-slate-50/30 opacity-40 dark:bg-slate-800/10'
                    : isQualifying
                    ? 'border-teal-200 bg-teal-50/60 dark:border-teal-800/60 dark:bg-teal-950/40'
                    : isToday
                    ? 'border-teal-500 bg-white shadow-xs dark:border-teal-400 dark:bg-slate-900'
                    : 'border-slate-100 bg-white hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isToday
                        ? 'flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white'
                        : isQualifying
                        ? 'text-teal-900 dark:text-teal-200'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {isQualifying && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  )}
                </div>

                <div className="mt-1">
                  {isQualifying ? (
                    <span className="font-mono text-[11px] font-bold text-teal-800 dark:text-teal-300">
                      {Math.round(recordedMinutes)}m ✓
                    </span>
                  ) : recordedMinutes > 0 ? (
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {Math.round(recordedMinutes)}m
                    </span>
                  ) : isFuture ? (
                    <span className="text-[10px] text-slate-300 dark:text-slate-600">—</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 dark:text-slate-600">0m</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 rounded-sm bg-teal-100 border border-teal-300 dark:bg-teal-950 dark:border-teal-800" />
            <span>Qualifying Day (≥ 60 min)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 rounded-sm border-2 border-teal-500" />
            <span>Today's Date</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 rounded-sm bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700" />
            <span>Incomplete / Rest Day</span>
          </div>
        </div>
      </div>

      {/* Streak Milestones */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Consecutive Streak Milestones
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m) => {
            const isUnlocked = streakStats.currentStreak >= m.days || streakStats.longestStreak >= m.days;
            return (
              <div
                key={m.days}
                className={`rounded-xl border p-4 transition-colors ${
                  isUnlocked
                    ? 'border-teal-200 bg-teal-50/60 dark:border-teal-900/60 dark:bg-teal-950/40'
                    : 'border-slate-100 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      isUnlocked
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                    }`}
                  >
                    <Award className="h-5 w-5" />
                  </div>
                  {isUnlocked ? (
                    <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Locked</span>
                  )}
                </div>
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.label}</h4>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Encouragement & Compassionate Guidance */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
        <div className="flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white">
              Remember: Missed Days Never Erase Your Learned Skills
            </span>
            <p>
              College schedules at JNTUK and mid-term exams can be hectic. If you miss a day, your historical knowledge and longest streak record remain untouched. Every morning is a clean slate to begin another streak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
