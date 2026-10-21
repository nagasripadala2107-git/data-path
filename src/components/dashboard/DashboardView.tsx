import React, { useState } from 'react';
import {
  Play,
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Plus,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatFriendlyDate, formatDuration, formatMinutesHuman } from '../../utils/dateUtils';

export const DashboardView: React.FC = () => {
  const {
    userProfile,
    streakStats,
    sessions,
    roadmapWeeks,
    semesterSubjects,
    setCurrentTab,
    startTimer,
    activeTimer,
  } = useApp();

  const todayDateStr = new Date();
  const goalMinutes = userProfile.dailyGoalMinutes || 60;
  const todayMinutes = streakStats.todayMinutes;
  const progressPercent = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));
  const remainingMinutes = Math.max(0, goalMinutes - Math.round(todayMinutes));

  // Compute total study hours across all sessions
  const totalStudyMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  // Find current roadmap week (first week that has incomplete tasks, or Week 1)
  const currentWeek =
    roadmapWeeks.find((w) => w.tasks.some((t) => !t.completed)) || roadmapWeeks[0];

  // Calculate overall roadmap progress
  const allTasks = roadmapWeeks.flatMap((w) => w.tasks);
  const completedTasksCount = allTasks.filter((t) => t.completed).length;
  const roadmapProgressPercent = Math.round((completedTasksCount / allTasks.length) * 100);

  // Recent 5 sessions
  const recentSessions = [...sessions].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <span>{userProfile.college} · {userProfile.branch}</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Welcome back, {userProfile.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {formatFriendlyDate(new Date().toISOString().split('T')[0])} · Goal: 1 hour daily towards Data Engineering
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (!activeTimer.isRunning) {
                  startTimer('roadmap', `Week ${currentWeek.weekNumber}: ${currentWeek.title}`);
                }
                setCurrentTab('timer');
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors"
            >
              <Play className="h-4 w-4 fill-current" />
              {activeTimer.isRunning ? 'Continue Studying' : 'Start Studying Now'}
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('study-plan')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Compass className="h-4 w-4 text-slate-500" />
              Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Goal Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Today's Progress</span>
            <div className="rounded-md bg-teal-50 p-1.5 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {Math.round(todayMinutes)}
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              / {goalMinutes} min
            </span>
          </div>
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  progressPercent >= 100 ? 'bg-emerald-500' : 'bg-teal-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{progressPercent}% completed</span>
              {remainingMinutes > 0 ? (
                <span>{remainingMinutes}m remaining</span>
              ) : (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Goal Achieved!</span>
              )}
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Streak</span>
            <div className="rounded-md bg-amber-50 p-1.5 text-amber-500 dark:bg-amber-950/60 dark:text-amber-400">
              <Flame className="h-4 w-4 fill-current" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {streakStats.currentStreak}
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">days</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Longest: <strong className="font-mono text-slate-800 dark:text-slate-200">{streakStats.longestStreak}d</strong></span>
            <span>Qualifying: <strong className="font-mono text-slate-800 dark:text-slate-200">{streakStats.totalQualifyingDays}d</strong></span>
          </div>
        </div>

        {/* Total Study Hours */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Study Time</span>
            <div className="rounded-md bg-sky-50 p-1.5 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {totalStudyHours}
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">hours</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            Across <strong className="font-mono text-slate-800 dark:text-slate-200">{sessions.length}</strong> logged sessions
          </div>
        </div>

        {/* Roadmap Milestone */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Milestone</span>
            <div className="rounded-md bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-slate-900 truncate dark:text-white">
              Week {currentWeek.weekNumber}
            </div>
            <div className="text-xs text-slate-500 truncate dark:text-slate-400">
              {currentWeek.title}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Roadmap progress</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{roadmapProgressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Current Roadmap Focus + Semester Balance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 spans): Active Roadmap Week & Tasks */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Active Study Focus · Phase {currentWeek.phaseId}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Week {currentWeek.weekNumber}: {currentWeek.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {currentWeek.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('study-plan')}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
              >
                View 24 Weeks <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Task list for this week */}
            <div className="mt-4 space-y-2.5">
              {currentWeek.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-colors dark:border-slate-800/80 dark:bg-slate-800/40"
                >
                  <div className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-medium leading-relaxed ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.practicalExercise && (
                      <p className="mt-1 text-[11px] text-teal-700 dark:text-teal-400">
                        Exercise: {task.practicalExercise}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      startTimer('roadmap', `Week ${currentWeek.weekNumber}: ${task.title}`);
                      setCurrentTab('timer');
                    }}
                    title="Study this task now with timer"
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-teal-600 dark:hover:bg-slate-800 dark:hover:text-teal-400"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 flex justify-end sm:hidden">
              <button
                type="button"
                onClick={() => setCurrentTab('study-plan')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400"
              >
                View 24 Weeks <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Study Activity</h3>
              <button
                type="button"
                onClick={() => setCurrentTab('study-log')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
              >
                View Full Log
              </button>
            </div>

            {recentSessions.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <Clock className="h-6 w-6" />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No study sessions recorded yet
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Start your first 60-minute study timer or log a manual study session to track your journey towards becoming a Data Engineer.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentTab('timer')}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Start Timer
                </button>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                {recentSessions.map((session) => (
                  <div key={session.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-3">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {session.topicOrSubject}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{session.date}</span>
                        <span>·</span>
                        <span className="capitalize">{session.category}</span>
                        <span>·</span>
                        <span className="capitalize">{session.type}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {session.durationMinutes}m
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: College Semester Status & Quick Launch */}
        <div className="space-y-6">
          {/* Semester Subjects Quick Glance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Semester Subjects (2nd Yr)
              </h3>
              <button
                type="button"
                onClick={() => setCurrentTab('semester')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
              >
                Manage
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {semesterSubjects.slice(0, 5).map((subject) => {
                const totalTopics = subject.units.flatMap((u) => u.topics).length;
                const completedTopics = subject.units
                  .flatMap((u) => u.topics)
                  .filter((t) => t.isCompleted).length;
                const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

                return (
                  <div
                    key={subject.id}
                    onClick={() => setCurrentTab('semester')}
                    className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-slate-100/60 transition-colors dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {subject.name}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        {percent}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{completedTopics}/{totalTopics} topics</span>
                      {subject.examDate && (
                        <span>Exam: {subject.examDate}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Study Tip Card */}
          <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-5 dark:border-teal-900/40 dark:bg-teal-950/30">
            <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-semibold text-xs mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Daily 1-Hour Habit Rule</span>
            </div>
            <p className="text-xs text-teal-900/80 dark:text-teal-200 leading-relaxed">
              As a 2nd year B.Tech student, consistency beats cramming. Dedicate 60 focused minutes every single day: 40 minutes on Data Engineering roadmap projects and 20 minutes on JNTUK semester revision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
