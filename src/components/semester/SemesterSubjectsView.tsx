import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Star,
  RotateCcw,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Save,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SemesterSubject, RevisionPlanItem } from '../../types';

export const SemesterSubjectsView: React.FC = () => {
  const {
    semesterSubjects,
    addSemesterSubject,
    updateSemesterSubject,
    deleteSemesterSubject,
    toggleSemesterTopic,
    incrementTopicRevision,
    addSemesterUnit,
    addSemesterTopic,
    deleteSemesterTopic,
    revisionPlan,
    addRevisionPlanItem,
    toggleRevisionPlanItem,
    deleteRevisionPlanItem,
    startTimer,
    setCurrentTab,
  } = useApp();

  const [activeSubjectId, setActiveSubjectId] = useState<string>(
    semesterSubjects[0]?.id || ''
  );
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState<{ unitId: string } | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicIsImportant, setNewTopicIsImportant] = useState(false);

  // New subject state
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubPriority, setNewSubPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newSubExamDate, setNewSubExamDate] = useState('');

  // Revision plan item state
  const [revWeek, setRevWeek] = useState<1 | 2 | 3 | 4>(1);
  const [revTopic, setRevTopic] = useState('');
  const [revTargetDate, setRevTargetDate] = useState('');

  const currentSubject =
    semesterSubjects.find((s) => s.id === activeSubjectId) || semesterSubjects[0];

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    addSemesterSubject({
      name: newSubName.trim(),
      code: newSubCode.trim() || 'CS21xx',
      priority: newSubPriority,
      examDate: newSubExamDate,
      units: [
        {
          id: `u-${Date.now()}`,
          unitNumber: 1,
          title: 'Unit 1: Fundamentals & Introduction',
          topics: [],
        },
      ],
    });
    setNewSubName('');
    setNewSubCode('');
    setNewSubExamDate('');
    setShowAddSubjectModal(false);
  };

  const handleCreateTopic = (unitId: string) => {
    if (!newTopicTitle.trim()) return;
    addSemesterTopic(currentSubject.id, unitId, newTopicTitle.trim(), newTopicIsImportant);
    setNewTopicTitle('');
    setNewTopicIsImportant(false);
    setShowAddTopicModal(null);
  };

  const handleAddRevisionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revTopic.trim() || !currentSubject) return;
    addRevisionPlanItem({
      subjectId: currentSubject.id,
      weekNumber: revWeek,
      topic: revTopic.trim(),
      completed: false,
      targetDate: revTargetDate || new Date().toISOString().split('T')[0],
    });
    setRevTopic('');
    setRevTargetDate('');
  };

  // Compute stats for current subject
  const allTopicsInCurrentSub = currentSubject
    ? currentSubject.units.flatMap((u) => u.topics)
    : [];
  const completedTopicsCount = allTopicsInCurrentSub.filter((t) => t.isCompleted).length;
  const currentSubjectPercent =
    allTopicsInCurrentSub.length > 0
      ? Math.round((completedTopicsCount / allTopicsInCurrentSub.length) * 100)
      : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <BookOpen className="h-4 w-4" />
              <span>B.Tech 2nd Year Academic Curriculum</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Semester Subjects
            </h1>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Balance college exams alongside your Data Engineering journey without burnout.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddSubjectModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        </div>

        {/* Subject Pills Selection */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          {semesterSubjects.map((sub) => {
            const isSelected = sub.id === currentSubject?.id;
            const topics = sub.units.flatMap((u) => u.topics);
            const done = topics.filter((t) => t.isCompleted).length;
            const pct = topics.length > 0 ? Math.round((done / topics.length) * 100) : 0;

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveSubjectId(sub.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span>{sub.name}</span>
                <span
                  className={`font-mono text-[10px] rounded px-1.5 py-0.5 ${
                    isSelected
                      ? 'bg-teal-700 text-teal-100'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {pct}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {currentSubject ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Subject Syllabus Column (2 col) */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400">
                      {currentSubject.code}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Priority: {currentSubject.priority}
                    </span>
                    {currentSubject.examDate && (
                      <>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-xs text-amber-600 dark:text-amber-400">
                          Exam: {currentSubject.examDate}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {currentSubject.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      startTimer('semester', `${currentSubject.name} Revision`);
                      setCurrentTab('timer');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Study Subject
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete subject "${currentSubject.name}"?`)) {
                        deleteSemesterSubject(currentSubject.id);
                        if (semesterSubjects.length > 1) {
                          setActiveSubjectId(semesterSubjects[0].id);
                        }
                      }
                    }}
                    className="rounded-lg p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Delete subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Subject Units & Topics */}
              <div className="mt-6 space-y-6">
                {currentSubject.units.map((unit) => (
                  <div key={unit.id} className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {unit.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAddTopicModal({ unitId: unit.id })}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                      >
                        <Plus className="h-3 w-3" />
                        Add Topic
                      </button>
                    </div>

                    {unit.topics.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No topics added in this unit yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {unit.topics.map((topic) => (
                          <div
                            key={topic.id}
                            className={`flex items-start justify-between gap-3 rounded-xl border p-3 transition-colors ${
                              topic.isCompleted
                                ? 'border-emerald-100 bg-emerald-50/30 dark:border-emerald-950/50 dark:bg-emerald-950/20'
                                : 'border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={topic.isCompleted}
                                onChange={() =>
                                  toggleSemesterTopic(currentSubject.id, unit.id, topic.id)
                                }
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs font-medium leading-relaxed ${
                                      topic.isCompleted
                                        ? 'line-through text-slate-400 dark:text-slate-500'
                                        : 'text-slate-900 dark:text-slate-100'
                                    }`}
                                  >
                                    {topic.title}
                                  </span>
                                  {topic.isImportant && (
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                                  )}
                                </div>

                                <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                                  <span>Revised: {topic.revisionCount || 0} times</span>
                                  {topic.lastRevised && (
                                    <span>Last: {topic.lastRevised}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  incrementTopicRevision(currentSubject.id, unit.id, topic.id)
                                }
                                title="Increment revision count"
                                className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300"
                              >
                                <RotateCcw className="h-3 w-3" />
                                +1 Rev
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteSemesterTopic(currentSubject.id, unit.id, topic.id)
                                }
                                title="Delete topic"
                                className="rounded p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Unit Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const unitTitle = prompt('Enter Unit Title (e.g., Unit 4: Concurrency & Recovery):');
                    if (unitTitle?.trim()) {
                      addSemesterUnit(currentSubject.id, unitTitle.trim());
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                >
                  <Plus className="h-4 w-4" />
                  Add New Unit
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 4-Week Semester Exam Revision Planner */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  4-Week Revision Planner
                </h3>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Schedule focused 20-minute daily review targets leading up to university exams.
              </p>

              {/* Add Revision Item Form */}
              <form onSubmit={handleAddRevisionItem} className="mt-4 space-y-2.5">
                <div>
                  <select
                    value={revWeek}
                    onChange={(e) => setRevWeek(Number(e.target.value) as 1 | 2 | 3 | 4)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value={1}>Week 1: Core concepts review</option>
                    <option value={2}>Week 2: Mid-syllabus practice</option>
                    <option value={3}>Week 3: Previous papers / questions</option>
                    <option value={4}>Week 4: Final mock questions & formulas</option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Revision focus (e.g. B-Trees & AVL rotations)"
                    value={revTopic}
                    onChange={(e) => setRevTopic(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-teal-600 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  Schedule Revision Target
                </button>
              </form>

              {/* Revision Items Checklist */}
              <div className="mt-5 space-y-2">
                {revisionPlan.length === 0 ? (
                  <p className="text-center py-4 text-xs text-slate-400 italic">
                    No revision targets scheduled yet. Add one above!
                  </p>
                ) : (
                  revisionPlan.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-start justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={it.completed}
                          onChange={() => toggleRevisionPlanItem(it.id)}
                          className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <span
                            className={`font-medium truncate block ${
                              it.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            W{it.weekNumber}: {it.topic}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteRevisionPlanItem(it.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Semester Subject</h3>
              <button
                type="button"
                onClick={() => setShowAddSubjectModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Subject Name (e.g. Operating Systems)
                </label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Subject Code (e.g. CS2105)
                </label>
                <input
                  type="text"
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  placeholder="CS2105"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={newSubPriority}
                    onChange={(e) => setNewSubPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Exam Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newSubExamDate}
                    onChange={(e) => setNewSubExamDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Add New Topic
            </h3>
            <input
              type="text"
              placeholder="Topic Title (e.g. Red-Black Tree Rotations)"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <label className="mt-3 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={newTopicIsImportant}
                onChange={(e) => setNewTopicIsImportant(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>Mark as high-yield / important exam topic</span>
            </label>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddTopicModal(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleCreateTopic(showAddTopicModal.unitId)}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
              >
                Add Topic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
