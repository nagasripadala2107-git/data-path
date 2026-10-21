import React from 'react';
import { Award, Flame, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CelebrationModal: React.FC = () => {
  const { celebrationModal, dismissCelebration } = useApp();

  if (!celebrationModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-teal-200 bg-white p-6 shadow-xl transition-all dark:border-teal-900/60 dark:bg-slate-900">
        <button
          type="button"
          onClick={dismissCelebration}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          aria-label="Close celebration modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 shadow-inner dark:bg-teal-950/80 dark:text-teal-300">
            {celebrationModal.type === 'streak_milestone' ? (
              <Flame className="h-9 w-9 text-amber-500 fill-amber-500" />
            ) : (
              <CheckCircle2 className="h-9 w-9 text-teal-600 dark:text-teal-400" />
            )}
          </div>

          <span className="text-xs font-semibold tracking-wider uppercase text-teal-700 dark:text-teal-400 mb-1">
            {celebrationModal.type === 'streak_milestone' ? 'Streak Milestone Unlocked' : 'Daily Goal Achieved'}
          </span>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {celebrationModal.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {celebrationModal.message}
          </p>

          <button
            type="button"
            onClick={dismissCelebration}
            className="w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Keep Up the Great Work!
          </button>
        </div>
      </div>
    </div>
  );
};
