import React, { useState } from 'react';
import {
  FolderGit2,
  CheckCircle2,
  ExternalLink,
  Plus,
  GitBranch,
  Calendar,
  Save,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PortfolioProject, ProjectStatus } from '../../types';

export const ProjectsTrackerView: React.FC = () => {
  const { projects, updateProject, toggleProjectTask, addProject } = useApp();

  const [expandedProjectId, setExpandedProjectId] = useState<string>(projects[0]?.id || '');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // New project state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDiff, setNewDiff] = useState<'Beginner' | 'Intermediate'>('Beginner');
  const [newSkills, setNewSkills] = useState('Python, SQL, PostgreSQL');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addProject({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom data engineering project.',
      difficulty: newDiff,
      status: 'Not Started',
      objectives: ['Implement robust data ingestion', 'Clean and normalize data', 'Load into database and document'],
      skillsPracticed: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      tasks: [
        { id: `t-${Date.now()}-1`, title: 'Define data schema and sample dataset', completed: false },
        { id: `t-${Date.now()}-2`, title: 'Write transformation and validation script', completed: false },
        { id: `t-${Date.now()}-3`, title: 'Store in database and verify integrity', completed: false },
        { id: `t-${Date.now()}-4`, title: 'Create GitHub repository with README', completed: false },
      ],
      githubUrl: '',
      notes: '',
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddProjectModal(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <FolderGit2 className="h-4 w-4" />
              <span>Resume & GitHub Portfolio Anchor</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Portfolio Projects Tracker
            </h1>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Build end-to-end data pipelines to prove your skills to internship recruiters.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddProjectModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Custom Project
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-5">
        {projects.map((project) => {
          const isExpanded = expandedProjectId === project.id;
          const completedCount = project.tasks.filter((t) => t.completed).length;
          const totalTasks = project.tasks.length;
          const percent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

          return (
            <div
              key={project.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedProjectId(isExpanded ? '' : project.id)}
                className="flex cursor-pointer flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-2xl"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-teal-700 dark:text-teal-300">
                      {project.difficulty}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        project.status === 'Completed'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : project.status === 'In Progress'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-500'
                      }`}
                    >
                      Status: {project.status}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
                    {project.title}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                      {percent}%
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {completedCount}/{totalTasks} tasks
                    </div>
                  </div>

                  <div className="w-20 sm:w-24 h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        percent === 100 ? 'bg-emerald-500' : 'bg-teal-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    aria-label={isExpanded ? 'Collapse project details' : 'Expand project details'}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Project Details */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-6 space-y-6 dark:border-slate-800">
                  {/* Skills Practiced */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Skills & Technologies Practiced
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-700 dark:text-slate-300">
                      {project.skillsPracticed.map((skill, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-800 font-medium dark:bg-slate-800 dark:text-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Task Checklist */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Implementation Checklist
                    </h3>
                    <div className="space-y-2">
                      {project.tasks.map((task) => (
                        <label
                          key={task.id}
                          className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                            task.completed
                              ? 'border-emerald-100 bg-emerald-50/40 dark:border-emerald-950/60 dark:bg-emerald-950/20'
                              : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-800/30'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleProjectTask(project.id, task.id)}
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                          />
                          <span
                            className={`text-xs font-medium ${
                              task.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {task.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dates & GitHub Repo Link */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        GitHub Repository Link
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="https://github.com/nagasri/student-performance-etl"
                          value={project.githubUrl || ''}
                          onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                            title="Open repository"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Target Completion Date
                      </label>
                      <input
                        type="date"
                        value={project.targetCompletionDate || ''}
                        onChange={(e) =>
                          updateProject(project.id, { targetCompletionDate: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Personal Notes */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Project Notes & Architecture Decisions
                    </label>
                    <textarea
                      rows={2}
                      value={project.notes || ''}
                      onChange={(e) => updateProject(project.id, { notes: e.target.value })}
                      placeholder="e.g. Used Kaggle Student Exam dataset, chose PostgreSQL for window function testing."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Add Custom Portfolio Project
            </h3>
            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weather Data Daily Batch Pipeline"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Description & Business Outcome
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What data does this ingest and what analytical reports does it produce?"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newDiff}
                    onChange={(e) => setNewDiff(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
