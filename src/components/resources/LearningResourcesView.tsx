import React, { useState } from 'react';
import {
  Library,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Plus,
  Search,
  BookOpen,
  Video,
  FileCode,
  GraduationCap,
  X,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearningResource, ResourceType, DifficultyLevel } from '../../types';

export const LearningResourcesView: React.FC = () => {
  const {
    resources,
    addResource,
    toggleBookmarkResource,
    toggleCompleteResource,
    deleteResource,
  } = useApp();

  const [languageFilter, setLanguageFilter] = useState<'All' | 'English' | 'Telugu'>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('Python');
  const [newLanguage, setNewLanguage] = useState<'English' | 'Telugu'>('Telugu');
  const [newType, setNewType] = useState<ResourceType>('video');
  const [newDifficulty, setNewDifficulty] = useState<DifficultyLevel>('Beginner');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const allTopics = [
    'All',
    'Python',
    'SQL',
    'PostgreSQL',
    'Git and GitHub',
    'Pandas',
    'ETL and ELT',
    'Data Warehousing',
    'Apache Airflow',
    'Docker',
    'Cloud Fundamentals',
    'Spark',
    'Interview Preparation',
  ];

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    addResource({
      title: newTitle.trim(),
      topic: newTopic,
      language: newLanguage,
      type: newType,
      difficulty: newDifficulty,
      description: newDescription.trim() || 'Custom student curated learning resource.',
      url: newUrl.trim(),
      isCompleted: false,
      isBookmarked: true,
    });

    setNewTitle('');
    setNewDescription('');
    setNewUrl('');
    setShowAddModal(false);
  };

  const filteredResources = resources.filter((res) => {
    const matchesLanguage =
      languageFilter === 'All' || res.language === languageFilter;
    const matchesTopic = topicFilter === 'All' || res.topic === topicFilter;
    const matchesType = typeFilter === 'All' || res.type === typeFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.topic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLanguage && matchesTopic && matchesType && matchesSearch;
  });

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'practice':
        return <FileCode className="h-4 w-4" />;
      case 'course':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <Library className="h-4 w-4" />
              <span>Curated Reference Library</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Learning Resources
            </h1>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Verified official documentation, hands-on practice portals, and English & Telugu video guides.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Resource / Telugu Video
          </button>
        </div>

        {/* Search & Language Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tutorial, documentation, video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3.5 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Language Filter */}
          <div className="flex items-center gap-1.5">
            {(['All', 'English', 'Telugu'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguageFilter(lang)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  languageFilter === lang
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {lang === 'Telugu' ? 'Telugu (తెలుగు)' : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {allTopics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setTopicFilter(topic)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                topicFilter === topic
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            No resources match this filter. Use the button above to add custom tutorials or YouTube links!
          </div>
        ) : (
          filteredResources.map((res) => (
            <div
              key={res.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-colors ${
                res.isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-950/60 dark:bg-emerald-950/20'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div>
                {/* Clean unboxed metadata with separators (zero-pill discipline) */}
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span className="text-teal-700 dark:text-teal-300 font-semibold">{res.topic}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{res.language}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{res.difficulty}</span>
                </div>

                <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {res.title}
                </h3>

                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {res.description}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleBookmarkResource(res.id)}
                    title={res.isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
                    className={`rounded p-1.5 transition-colors ${
                      res.isBookmarked
                        ? 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-300'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    {res.isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCompleteResource(res.id)}
                    title={res.isCompleted ? 'Mark as incomplete' : 'Mark completed'}
                    className={`rounded p-1.5 transition-colors ${
                      res.isCompleted
                        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>

                  {res.isUserAdded && (
                    <button
                      type="button"
                      onClick={() => deleteResource(res.id)}
                      title="Delete resource"
                      className="rounded p-1.5 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Learning Resource / Tutorial
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddResource} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete SQL Course in Telugu"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Resource URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://youtube.com/watch?v=..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Topic
                  </label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {allTopics.filter((t) => t !== 'All').map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Language
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="video">Video Tutorial</option>
                    <option value="documentation">Documentation</option>
                    <option value="practice">Practice Exercises</option>
                    <option value="course">Course</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Notes on instructor, concepts covered, why it's useful..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
