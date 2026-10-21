import React from 'react';
import {
  Menu,
  X,
  Play,
  Pause,
  Clock,
  Flame,
  Sun,
  Moon,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDuration } from '../../utils/dateUtils';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const {
    currentTab,
    setCurrentTab,
    activeTimer,
    currentElapsedSeconds,
    pauseTimer,
    resumeTimer,
    streakStats,
    theme,
    setTheme,
    userProfile,
  } = useApp();

  const isTimerActive = activeTimer.isRunning;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md transition-colors sm:px-6 dark:border-slate-800 dark:bg-slate-900/95">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('dashboard')}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm font-bold tracking-wider">
            DP
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              DataPath
            </span>
            <span className="hidden text-[11px] font-medium text-slate-500 sm:inline dark:text-slate-400">
              My Data Engineering Journey
            </span>
          </div>
        </button>
      </div>

      {/* Middle: Active Timer pill (if running) */}
      <div className="flex items-center gap-2">
        {isTimerActive && (
          <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50/80 px-2.5 py-1 text-xs text-teal-900 shadow-xs dark:border-teal-900/50 dark:bg-teal-950/50 dark:text-teal-200">
            <span className="font-mono text-xs font-semibold tabular-nums">
              {formatDuration(currentElapsedSeconds)}
            </span>
            <span className="hidden max-w-[130px] truncate text-[11px] text-teal-700 sm:inline dark:text-teal-300">
              {activeTimer.topicOrSubject}
            </span>
            <div className="flex items-center gap-1">
              {activeTimer.isPaused ? (
                <button
                  type="button"
                  onClick={resumeTimer}
                  title="Resume Study Session"
                  className="rounded p-1 text-teal-700 hover:bg-teal-200/60 dark:text-teal-300 dark:hover:bg-teal-800/50"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={pauseTimer}
                  title="Pause Study Session"
                  className="rounded p-1 text-teal-700 hover:bg-teal-200/60 dark:text-teal-300 dark:hover:bg-teal-800/50"
                >
                  <Pause className="h-3.5 w-3.5 fill-current" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setCurrentTab('timer')}
                className="ml-1 text-[11px] font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-900 dark:text-teal-300"
              >
                Open
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Quick Stats & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak summary pill */}
        <button
          type="button"
          onClick={() => setCurrentTab('streak')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
          title="View Streak Calendar"
        >
          <Flame
            className={`h-4 w-4 ${
              streakStats.currentStreak > 0
                ? 'text-amber-500 fill-amber-500'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          />
          <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
            {streakStats.currentStreak}
          </span>
          <span className="hidden text-slate-500 sm:inline dark:text-slate-400">days</span>
        </button>

        {/* Today's goal progress summary */}
        <button
          type="button"
          onClick={() => setCurrentTab('timer')}
          className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-100 sm:flex dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300"
          title="Daily Study Target (60 mins)"
        >
          <Clock className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
            {Math.round(streakStats.todayMinutes)}/{userProfile.dailyGoalMinutes}m
          </span>
          {streakStats.todayGoalMet && (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};
