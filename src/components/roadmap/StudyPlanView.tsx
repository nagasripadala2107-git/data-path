import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Play,
  BookOpen,
  Filter,
  Milestone,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROADMAP_PHASES } from '../../data/initialData';

export const StudyPlanView: React.FC = () => {
  const {
    roadmapWeeks,
    toggleRoadmapTask,
    updateRoadmapTaskNotes,
    startTimer,
    setCurrentTab,
  } = useApp();

  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true });
  const [activeNotesWeek, setActiveNotesWeek] = useState<number | null>(null);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekNumber]: !prev[weekNumber],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    roadmapWeeks.forEach((w) => {
      allExpanded[w.weekNumber] = true;
    });
    setExpandedWeeks(allExpanded);
  };

  const collapseAll = () => {
    setExpandedWeeks({});
  };

  // Filter weeks
  const filteredWeeks = roadmapWeeks.filter((week) => {
    const matchesPhase = selectedPhase === 'all' || week.phaseId === selectedPhase;
    const matchesSearch =
      searchQuery.trim() === '' ||
      week.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      week.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      week.tasks.some(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.practicalExercise && t.practicalExercise.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    return matchesPhase && matchesSearch;
  });

  // Calculate overall stats
  const totalTasks = roadmapWeeks.flatMap((w) => w.tasks).length;
  const completedTasks = roadmapWeeks.flatMap((w) => w.tasks).filter((t) => t.completed).length;
  const overallPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Overall Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <Milestone className="h-4 w-4" />
              <span>24-Week Structured Curriculum</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Data Engineering Study Plan
            </h1>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Tailored for 1 hour per day alongside B.Tech 2nd year semester academics at JNTUK.
            </p>
          </div>

          <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-3.5 sm:px-5 dark:border-teal-900/50 dark:bg-teal-950/40">
            <div className="text-[11px] font-medium text-teal-700 dark:text-teal-300">Total Progress</div>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tabular-nums text-teal-950 dark:text-teal-100">
                {overallPercent}%
              </span>
              <span className="text-xs text-teal-800 dark:text-teal-300">
                ({completedTasks}/{totalTasks} tasks)
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Python, SQL, Airflow, Spark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3.5 text-xs text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Phase Pill Selector */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedPhase('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedPhase === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            All 6 Phases (24 Weeks)
          </button>
          {ROADMAP_PHASES.map((phase) => (
            <button
              key={phase.id}
              type="button"
              onClick={() => setSelectedPhase(phase.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedPhase === phase.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              Phase {phase.id} ({phase.weeksRange})
            </button>
          ))}
        </div>
      </div>

      {/* Week Cards List */}
      <div className="space-y-4">
        {filteredWeeks.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            No roadmap weeks match your search criteria. Try a different keyword or reset filters.
          </div>
        ) : (
          filteredWeeks.map((week) => {
            const isExpanded = !!expandedWeeks[week.weekNumber];
            const completedCount = week.tasks.filter((t) => t.completed).length;
            const weekPercent = Math.round((completedCount / week.tasks.length) * 100);
            const isAllCompleted = completedCount === week.tasks.length;

            return (
              <div
                key={week.weekNumber}
                className={`rounded-2xl border transition-all ${
                  isAllCompleted
                    ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                {/* Week Header */}
                <div
                  onClick={() => toggleWeek(week.weekNumber)}
                  className="flex cursor-pointer items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-2xl"
                >
                  <div className="flex items-start gap-3 sm:items-center">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${
                        isAllCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300'
                      }`}
                    >
                      W{week.weekNumber}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                          Phase {week.phaseId}
                        </span>
                        {week.isAdvancedExposure && (
                          <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                            Introductory Exposure
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                        {week.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1 dark:text-slate-400">
                        {week.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {completedCount}/{week.tasks.length} tasks
                      </div>
                      <div className="text-[11px] text-slate-400">{weekPercent}%</div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startTimer('roadmap', `Week ${week.weekNumber}: ${week.title}`);
                        setCurrentTab('timer');
                      }}
                      title="Study this week with Timer"
                      className="rounded-lg p-2 text-slate-400 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-slate-800 dark:hover:text-teal-400"
                    >
                      <Play className="h-4 w-4 fill-current" />
                    </button>

                    <button
                      type="button"
                      aria-label={isExpanded ? 'Collapse week details' : 'Expand week details'}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 space-y-4 dark:border-slate-800">
                    {/* Objectives */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Learning Objectives
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        {week.objectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Tasks & Practical Exercises */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Actionable Tasks & Exercises
                      </h4>
                      <div className="space-y-2">
                        {week.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                              task.completed
                                ? 'border-emerald-100 bg-emerald-50/40 dark:border-emerald-950/60 dark:bg-emerald-950/20'
                                : 'border-slate-100 bg-slate-50/60 dark:border-slate-800/80 dark:bg-slate-800/30'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleRoadmapTask(week.weekNumber, task.id)}
                              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                            />

                            <div className="flex-1 min-w-0">
                              <span
                                className={`text-xs font-semibold leading-relaxed ${
                                  task.completed
                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                    : 'text-slate-900 dark:text-slate-100'
                                }`}
                              >
                                {task.title}
                              </span>

                              {task.practicalExercise && (
                                <p className="mt-1 text-xs text-teal-700 dark:text-teal-400">
                                  <strong>Hands-on:</strong> {task.practicalExercise}
                                </p>
                              )}

                              {/* Task personal notes */}
                              <div className="mt-2">
                                <input
                                  type="text"
                                  value={task.notes || ''}
                                  placeholder="Add quick personal notes or GitHub link..."
                                  onChange={(e) =>
                                    updateRoadmapTaskNotes(week.weekNumber, task.id, e.target.value)
                                  }
                                  className="w-full text-[11px] rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                startTimer('roadmap', `Week ${week.weekNumber}: ${task.title}`);
                                setCurrentTab('timer');
                              }}
                              title="Start timer for this task"
                              className="shrink-0 rounded p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                            >
                              <Play className="h-3.5 w-3.5 fill-current" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
