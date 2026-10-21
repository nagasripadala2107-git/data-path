import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  BookOpen,
  Milestone,
  FileText,
  AlertCircle,
  Trash2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDuration, formatMinutesHuman, getLocalDateString } from '../../utils/dateUtils';
import { StudyCategory } from '../../types';

export const DailyStudyTimerView: React.FC = () => {
  const {
    activeTimer,
    currentElapsedSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    completeTimerSession,
    resetTimer,
    updateTimerMeta,
    sessions,
    deleteSession,
    streakStats,
    userProfile,
    roadmapWeeks,
    semesterSubjects,
  } = useApp();

  const [sessionNotes, setSessionNotes] = useState<string>(activeTimer.notes || '');

  const todayStr = getLocalDateString();
  const goalMinutes = userProfile.dailyGoalMinutes || 60;
  const todayMinutes = streakStats.todayMinutes;
  const progressPercent = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));
  const remainingMinutes = Math.max(0, goalMinutes - Math.round(todayMinutes));

  // Today's completed sessions
  const todaySessions = sessions.filter((s) => s.date === todayStr);

  const handleStart = () => {
    startTimer(activeTimer.category, activeTimer.topicOrSubject);
  };

  const handleComplete = () => {
    completeTimerSession(sessionNotes);
    setSessionNotes('');
  };

  const handleReset = () => {
    if (window.confirm('Reset this timer session? Elapsed time for this session will be discarded.')) {
      resetTimer();
      setSessionNotes('');
    }
  };

  // Quick preset topics
  const currentWeek =
    roadmapWeeks.find((w) => w.tasks.some((t) => !t.completed)) || roadmapWeeks[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Goal Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <Clock className="h-4 w-4" />
              <span>Daily Study Habit Engine</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Daily Study Timer
            </h1>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Target: At least 60 valid minutes per day to earn your daily streak and master Data Engineering.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-teal-100 bg-teal-50/70 p-3.5 sm:px-5 dark:border-teal-900/50 dark:bg-teal-950/40">
            <div>
              <div className="text-[11px] font-medium text-teal-700 dark:text-teal-300">Today's Total Time</div>
              <div className="mt-0.5 font-mono text-xl font-bold tabular-nums text-teal-950 dark:text-teal-100">
                {Math.round(todayMinutes)} / {goalMinutes} min
              </div>
            </div>
            {streakStats.todayGoalMet ? (
              <div className="flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>Goal Met!</span>
              </div>
            ) : (
              <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                <span>{remainingMinutes}m to qualify</span>
              </div>
            )}
          </div>
        </div>

        {/* Goal Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            <span>Daily Goal Progress</span>
            <span className="font-mono">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                progressPercent >= 100 ? 'bg-emerald-500' : 'bg-teal-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Timer Display Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Category & Topic Setup */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {(['roadmap', 'semester', 'project', 'interview'] as StudyCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              disabled={activeTimer.isRunning}
              onClick={() => updateTimerMeta({ category: cat })}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTimer.category === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              } ${activeTimer.isRunning ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <span className="capitalize">{cat === 'roadmap' ? 'Data Engineering Roadmap' : cat}</span>
            </button>
          ))}
        </div>

        {/* Topic Input / Selector */}
        <div className="max-w-md mx-auto mb-8">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 text-left">
            Current Study Topic / Focus:
          </label>
          <input
            type="text"
            value={activeTimer.topicOrSubject}
            onChange={(e) => updateTimerMeta({ topicOrSubject: e.target.value })}
            placeholder="e.g. Week 1: Python Loops or DBMS Normalization"
            disabled={activeTimer.isRunning && !activeTimer.isPaused}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          {/* Quick presets */}
          <div className="mt-2 flex flex-wrap gap-1.5 justify-start">
            <button
              type="button"
              onClick={() => updateTimerMeta({
                category: 'roadmap',
                topicOrSubject: `Week ${currentWeek.weekNumber}: ${currentWeek.title}`,
              })}
              className="text-[11px] text-teal-700 hover:underline dark:text-teal-400"
            >
              + Preset: Current Roadmap Week ({currentWeek.weekNumber})
            </button>
            {semesterSubjects[0] && (
              <button
                type="button"
                onClick={() => updateTimerMeta({
                  category: 'semester',
                  topicOrSubject: `${semesterSubjects[0].name} (Unit 1)`,
                })}
                className="text-[11px] text-teal-700 hover:underline dark:text-teal-400 ml-2"
              >
                + Preset: {semesterSubjects[0].name.split(' ')[0]}
              </button>
            )}
          </div>
        </div>

        {/* Big Digital Timer Display */}
        <div className="my-6">
          <div className="font-mono text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-white">
            {formatDuration(currentElapsedSeconds, true)}
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            {activeTimer.isRunning ? (
              activeTimer.isPaused ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  Paused (Paused time is not counted)
                </span>
              ) : (
                <span className="text-teal-600 dark:text-teal-400 font-semibold">
                  Timer Running (Tracking active focus time)
                </span>
              )
            ) : (
              <span>Ready to start focused session</span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {!activeTimer.isRunning ? (
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-teal-700 transition-colors"
            >
              <Play className="h-5 w-5 fill-current" />
              Start Study Session
            </button>
          ) : activeTimer.isPaused ? (
            <>
              <button
                type="button"
                onClick={resumeTimer}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-teal-700 transition-colors"
              >
                <Play className="h-5 w-5 fill-current" />
                Resume Session
              </button>

              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5" />
                Complete & Log Session
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={pauseTimer}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-amber-600 transition-colors"
              >
                <Pause className="h-5 w-5 fill-current" />
                Pause
              </button>

              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5" />
                Complete Session
              </button>
            </>
          )}
        </div>

        {/* Session Note Field */}
        <div className="max-w-md mx-auto mt-6 text-left">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Session Note (What did you learn / practice?):
          </label>
          <input
            type="text"
            value={sessionNotes}
            onChange={(e) => {
              setSessionNotes(e.target.value);
              updateTimerMeta({ notes: e.target.value });
            }}
            placeholder="e.g. Practiced 5 SQL joins on SQLBolt, took notes on LEFT JOIN"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Today's Completed Sessions List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Today's Completed Sessions ({todaySessions.length})
            </h3>
          </div>
          <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400">
            Total Today: {formatMinutesHuman(todayMinutes)}
          </span>
        </div>

        {todaySessions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No study sessions completed today yet. Start a session above to log your progress!
          </div>
        ) : (
          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {todaySessions.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-3">
                  <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {s.topicOrSubject}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="capitalize">{s.category}</span>
                    <span>·</span>
                    <span>
                      {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {s.notes && (
                      <>
                        <span>·</span>
                        <span className="italic truncate max-w-xs">{s.notes}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                    {s.durationMinutes} min
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this recorded study session?')) {
                        deleteSession(s.id);
                      }
                    }}
                    title="Delete session"
                    className="rounded p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Midnight & Integrity Explainer */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white">
              Strict Study Time Integrity:
            </span>
            <p>
              Only active timer or clearly labeled manual study sessions count towards the 60-minute daily goal. Paused time and passive browser tabs are never counted. If a session crosses local midnight, DataPath automatically splits the recorded minutes into their respective local calendar dates without double counting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
