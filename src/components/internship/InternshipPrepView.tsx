import React, { useState } from 'react';
import {
  Briefcase,
  FileCheck2,
  FolderGit2,
  CheckCircle2,
  Plus,
  ExternalLink,
  Trash2,
  Edit2,
  Search,
  Calendar,
  AlertCircle,
  HelpCircle,
  X,
  Code,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InternshipApplication, ApplicationStatus } from '../../types';

export const InternshipPrepView: React.FC = () => {
  const {
    resumeChecklist,
    toggleResumeItem,
    githubChecklist,
    toggleGithubItem,
    practiceProblems,
    togglePracticeProblem,
    addPracticeProblem,
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tracker' | 'resume' | 'github' | 'practice'>('tracker');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [editingApp, setEditingApp] = useState<InternshipApplication | null>(null);

  // New application form state
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('Data Engineering Intern');
  const [appUrl, setAppUrl] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Interested');
  const [dateApplied, setDateApplied] = useState(new Date().toISOString().split('T')[0]);
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  // Practice problem form state
  const [newProbTitle, setNewProbTitle] = useState('');
  const [newProbTopic, setNewProbTopic] = useState('SQL');
  const [newProbDiff, setNewProbDiff] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const allStatuses: ApplicationStatus[] = [
    'Interested',
    'Preparing',
    'Applied',
    'Assessment',
    'Interview',
    'Offer',
    'Rejected',
  ];

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    if (editingApp) {
      updateApplication(editingApp.id, {
        companyName: companyName.trim(),
        role: role.trim(),
        applicationUrl: appUrl.trim(),
        status,
        dateApplied,
        followUpDate,
        notes,
      });
      setEditingApp(null);
    } else {
      addApplication({
        companyName: companyName.trim(),
        role: role.trim(),
        applicationUrl: appUrl.trim(),
        status,
        dateApplied,
        followUpDate,
        notes,
      });
    }

    setCompanyName('');
    setRole('Data Engineering Intern');
    setAppUrl('');
    setNotes('');
    setShowAddAppModal(false);
  };

  const handleOpenEdit = (app: InternshipApplication) => {
    setEditingApp(app);
    setCompanyName(app.companyName);
    setRole(app.role);
    setAppUrl(app.applicationUrl);
    setStatus(app.status);
    setDateApplied(app.dateApplied);
    setFollowUpDate(app.followUpDate || '');
    setNotes(app.notes);
    setShowAddAppModal(true);
  };

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProbTitle.trim()) return;
    addPracticeProblem({
      title: newProbTitle.trim(),
      topic: newProbTopic,
      difficulty: newProbDiff,
      completed: false,
    });
    setNewProbTitle('');
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <Briefcase className="h-4 w-4" />
              <span>Career & Internship Readiness</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Internship Preparation
            </h1>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Systematically prepare your resume, GitHub repositories, interview questions, and manage applications.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingApp(null);
              setCompanyName('');
              setRole('Data Engineering Intern');
              setAppUrl('');
              setNotes('');
              setShowAddAppModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Log Application
          </button>
        </div>

        {/* Tab Sub-navigation */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className={`rounded-xl px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'tracker'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Application Tracker ({applications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resume')}
            className={`rounded-xl px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'resume'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Resume Checklist
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`rounded-xl px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'github'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            GitHub Portfolio Checklist
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('practice')}
            className={`rounded-xl px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'practice'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Technical Practice Tracker
          </button>
        </div>
      </div>

      {/* Tab 1: Application Tracker */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search company, role, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setStatusFilter('All')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                  statusFilter === 'All'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                All
              </button>
              {allStatuses.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                    statusFilter === st
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Table / Cards */}
          {filteredApplications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <p className="font-medium text-slate-800 dark:text-slate-200 mb-1">
                No internship applications logged yet.
              </p>
              <p className="max-w-md mx-auto">
                Once you finish Phase 6 of the roadmap or start applying to target companies, record and monitor each submission here.
              </p>
              <button
                type="button"
                onClick={() => setShowAddAppModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Log Your First Application
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Company & Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date Applied</th>
                      <th className="px-4 py-3">Follow-Up</th>
                      <th className="px-4 py-3">Notes</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {app.companyName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {app.role}
                          </div>
                          {app.applicationUrl && (
                            <a
                              href={app.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-teal-600 hover:underline dark:text-teal-400"
                            >
                              Listing <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          {app.dateApplied}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          {app.followUpDate || '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {app.notes || '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(app)}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              title="Edit application"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete application for ${app.companyName}?`)) {
                                  deleteApplication(app.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-500"
                              title="Delete application"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Resume Checklist */}
      {activeTab === 'resume' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Data Engineering Student Resume Checklist
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Ensure your 1-page resume strictly follows technical recruiting and ATS standards for 2nd/3rd-year internships.
            </p>
          </div>

          <div className="space-y-2.5">
            {resumeChecklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${
                  item.completed
                    ? 'border-emerald-100 bg-emerald-50/40 dark:border-emerald-950/60 dark:bg-emerald-950/20'
                    : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-800/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleResumeItem(item.id)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span
                  className={`text-xs font-medium leading-relaxed ${
                    item.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: GitHub Portfolio Checklist */}
      {activeTab === 'github' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              GitHub Profile & Repository Standards
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your GitHub portfolio is your primary proof of competency for hiring managers.
            </p>
          </div>

          <div className="space-y-2.5">
            {githubChecklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${
                  item.completed
                    ? 'border-emerald-100 bg-emerald-50/40 dark:border-emerald-950/60 dark:bg-emerald-950/20'
                    : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-800/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleGithubItem(item.id)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span
                  className={`text-xs font-medium leading-relaxed ${
                    item.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Practice Problems Tracker */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  SQL & Python Interview Practice Bank
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Track core technical interview problems frequently asked in data engineering tests.
                </p>
              </div>
            </div>

            {/* Quick add problem */}
            <form onSubmit={handleAddProblem} className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Add problem title (e.g. SQL: Running Total Sales)..."
                value={newProbTitle}
                onChange={(e) => setNewProbTitle(e.target.value)}
                className="flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <select
                value={newProbTopic}
                onChange={(e) => setNewProbTopic(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="SQL">SQL</option>
                <option value="Python">Python</option>
                <option value="Data Modeling">Data Modeling</option>
              </select>
              <select
                value={newProbDiff}
                onChange={(e) => setNewProbDiff(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <button
                type="submit"
                className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
              >
                Add Problem
              </button>
            </form>

            <div className="space-y-2 mt-4">
              {practiceProblems.map((prob) => (
                <div
                  key={prob.id}
                  className={`flex items-start justify-between gap-3 rounded-xl border p-3 transition-colors ${
                    prob.completed
                      ? 'border-emerald-100 bg-emerald-50/40 dark:border-emerald-950/60 dark:bg-emerald-950/20'
                      : 'border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/30'
                  }`}
                >
                  <label className="flex items-start gap-2.5 flex-1 min-w-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prob.completed}
                      onChange={() => togglePracticeProblem(prob.id)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold ${
                            prob.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {prob.title}
                        </span>
                        <span className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                          {prob.topic} · {prob.difficulty}
                        </span>
                      </div>
                      {prob.notes && (
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {prob.notes}
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Application Modal */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingApp ? 'Edit Application' : 'Log Internship Application'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAppModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApp} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiggy, TCS, Startup Labs"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Application Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {allStatuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Date Applied
                  </label>
                  <input
                    type="date"
                    required
                    value={dateApplied}
                    onChange={(e) => setDateApplied(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Job / Posting URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={appUrl}
                    onChange={(e) => setAppUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Notes (Referral person, interview rounds, feedback)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Applied through JNTUK alumni referral, OA had 2 SQL queries."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAppModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  {editingApp ? 'Update Application' : 'Save Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
