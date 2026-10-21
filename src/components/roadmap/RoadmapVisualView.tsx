import React from 'react';
import {
  Database,
  Terminal,
  Server,
  Cloud,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROADMAP_PHASES } from '../../data/initialData';

export const RoadmapVisualView: React.FC = () => {
  const { roadmapWeeks, setCurrentTab } = useApp();

  const phaseIcons = [Terminal, Database, Layers, GitBranch, Cloud, Cpu];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          <GitBranch className="h-4 w-4" />
          <span>Architectural Curriculum Flow</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Data Engineering Roadmap
        </h1>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Step-by-step career path from Python and SQL beginner to building end-to-end cloud and portfolio pipelines.
        </p>
      </div>

      {/* Visual Phase Pipeline */}
      <div className="space-y-6">
        {ROADMAP_PHASES.map((phase, idx) => {
          const Icon = phaseIcons[idx] || Layers;
          const weeksInPhase = roadmapWeeks.filter((w) => w.phaseId === phase.id);
          const tasksInPhase = weeksInPhase.flatMap((w) => w.tasks);
          const completedInPhase = tasksInPhase.filter((t) => t.completed).length;
          const percentInPhase = tasksInPhase.length > 0 ? Math.round((completedInPhase / tasksInPhase.length) * 100) : 0;

          return (
            <div
              key={phase.id}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      {phase.weeksRange}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {phase.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                      {percentInPhase}%
                    </span>
                    <span className="ml-1 text-[11px] text-slate-500 dark:text-slate-400">
                      ({completedInPhase}/{tasksInPhase.length})
                    </span>
                  </div>
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                    <div
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${percentInPhase}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                {phase.description}
              </p>

              {/* Weeks Cards Grid inside this Phase */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {weeksInPhase.map((week) => {
                  const completedWeekTasks = week.tasks.filter((t) => t.completed).length;
                  const weekDone = completedWeekTasks === week.tasks.length && week.tasks.length > 0;

                  return (
                    <div
                      key={week.weekNumber}
                      onClick={() => setCurrentTab('study-plan')}
                      className={`cursor-pointer rounded-xl border p-3 transition-colors hover:shadow-xs ${
                        weekDone
                          ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                          : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
                          Week {week.weekNumber}
                        </span>
                        {weekDone && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <h3 className="mt-1 text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {week.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {week.description}
                      </p>
                      <div className="mt-2 text-[10px] text-slate-400">
                        {completedWeekTasks}/{week.tasks.length} tasks completed
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
