import React, { useState } from 'react';
import {
  History,
  Plus,
  Calendar,
  Clock,
  BookOpen,
  Filter,
  Trash2,
  CheckCircle2,
  Search,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudyCategory } from '../../types';
import { formatMinutesHuman, getLocalDateString, formatFriendlyDate } from '../../utils/dateUtils';

export const DailyStudyLogView: React.FC = () => {
  const {
    sessions,
    dailyStudyLogs,
    addManualStudySession,
    deleteSession,
    streakStats,
    userProfile,
  } = useApp();

  const [showManualModal, setShowManualModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Manual session form state
  const [manualDate, setManualDate] = useState(getLocalDateString());
  const [manualMinutes, setManualMinutes] = useState('60');
  const [manualCategory, setManualCategory] = useState<StudyCategory>('roadmap');
  const [manualTopic, setManualTopic] = useState('');
  const [manualLearned, setManualLearned] = useState('');
  const [manualChallenges, setManualChallenges] = useState('');
  const [manualNextStep, setManualNextStep] = useState('');

  const handleCreateManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    const durationMins = parseFloat(manualMinutes);
    if (isNaN(durationMins) || durationMins <= 0 || !manualTopic.trim()) return;

    addManualStudySession({
      date: manualDate,
      durationMinutes: durationMins,
      category: manualCategory,
      topicOrSubject: manualTopic.trim(),
      whatILearned: manualLearned.trim() || 'Studied key topics and solved practical exercises.',
      challenges: manualChallenges.trim(),
      nextStep: manualNextStep.trim(),
    });

    setManualTopic('');
    setManualLearned('');
    setManualChallenges('');
    setManualNextStep('');
    setShowManualModal(false);
  };

  // Aggregated analytics
  const totalStudyMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalHours = (totalStudyMinutes / 60).toFixed(1);

  // Category breakdown
  const categoryMinutes: Record<string, number> = {};
  sessions.forEach((s) => {
    categoryMinutes[s.category] = (categoryMinutes[s.category] || 0) + (s.durationMinutes || 0);
  });

  // Filtered sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesCategory = filterCategory === 'All' || s.category === filterCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      s.topicOrSubject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.date.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <History className="h-4 w-4" />
              <span>Verifiable Study Records</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Daily Study Log
            </h1>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Single source of truth for all timer-tracked and manual study sessions contributing to your daily goal.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Log Manual Study Session
          </button>
        </div>

        {/* Aggregated Quick Metrics */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Study Time</span>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
              {totalHours} hrs
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{sessions.length} sessions logged</span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-xs text-slate-500 dark:text-slate-400">Roadmap Focus</span>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-teal-700 dark:text-teal-300">
              {formatMinutesHuman(categoryMinutes['roadmap'] || 0)}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Data Engineering tasks</span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-xs text-slate-500 dark:text-slate-400">Semester Studies</span>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-sky-700 dark:text-sky-300">
              {formatMinutesHuman(categoryMinutes['semester'] || 0)}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">B.Tech college subjects</span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-xs text-slate-500 dark:text-slate-400">Projects & Interview</span>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-purple-700 dark:text-purple-300">
              {formatMinutesHuman((categoryMinutes['project'] || 0) + (categoryMinutes['interview'] || 0))}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">ETL builds & SQL practice</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topic, notes, date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {['All', 'roadmap', 'semester', 'project', 'interview'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                filterCategory === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {cat === 'roadmap' ? 'Roadmap' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Logs Table */}
      {filteredSessions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            <Clock className="h-5 w-5" />
          </div>
          <p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">
            No study sessions found
          </p>
          <p className="mt-1 max-w-xs mx-auto">
            Use the study timer or click "Log Manual Study Session" to record your study time.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Topic / Subject</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Notes / Reflection</th>
                  <th className="px-4 py-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[...filteredSessions].reverse().map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {session.date}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white max-w-xs">
                      {session.topicOrSubject}
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {session.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider ${
                          session.type === 'timer'
                            ? 'text-teal-700 dark:text-teal-400'
                            : 'text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {session.type === 'timer' ? 'Timer Tracked' : 'Manual Entry'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {session.durationMinutes} min
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-sm text-[11px]">
                      {session.notes || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete this study log entry?')) {
                            deleteSession(session.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-500"
                        title="Delete log"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Log Manual Study Session
              </h3>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLog} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="600"
                    required
                    value={manualMinutes}
                    onChange={(e) => setManualMinutes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as StudyCategory)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="roadmap">Data Engineering Roadmap</option>
                  <option value="semester">B.Tech Semester Subject</option>
                  <option value="project">Portfolio Project</option>
                  <option value="interview">Interview Practice</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Topic / Subject Studied
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SQL Window Functions (ROW_NUMBER & RANK)"
                  value={manualTopic}
                  onChange={(e) => setManualTopic(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  What did you learn?
                </label>
                <textarea
                  rows={2}
                  value={manualLearned}
                  onChange={(e) => setManualLearned(e.target.value)}
                  placeholder="Key concepts grasped or exercises solved..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  Record Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
