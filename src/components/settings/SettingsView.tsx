import React, { useState, useRef } from 'react';
import {
  Settings,
  User,
  Shield,
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageOption } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    theme,
    setTheme,
    exportBackup,
    importBackup,
    resetAllData,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [importStatus, setImportStatus] = useState<{ msg: string; isError: boolean } | null>(null);
  const [exportStatus, setExportStatus] = useState<{ msg: string; isError: boolean } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form local state
  const [name, setName] = useState(userProfile.name);
  const [education, setEducation] = useState(userProfile.education);
  const [branch, setBranch] = useState(userProfile.branch);
  const [college, setCollege] = useState(userProfile.college);
  const [careerGoal, setCareerGoal] = useState(userProfile.careerGoal);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(userProfile.dailyGoalMinutes.toString());
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageOption>(userProfile.preferredLanguage);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMins = parseInt(dailyGoalMinutes, 10);
    updateUserProfile({
      name: name.trim() || 'Student',
      education: education.trim(),
      branch: branch.trim(),
      college: college.trim(),
      careerGoal: careerGoal.trim(),
      dailyGoalMinutes: isNaN(parsedMins) || parsedMins < 1 ? 60 : parsedMins,
      preferredLanguage,
    });
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await importBackup(file);
    if (res.success) {
      setImportStatus({ msg: res.message, isError: false });
    } else {
      setImportStatus({ msg: res.message, isError: true });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setTimeout(() => setImportStatus(null), 5000);
  };

  const handleExport = () => {
    try {
      const result = exportBackup();
      if (result.success) {
        setExportStatus({
          msg: `Backup file "${result.filename}" downloaded successfully. Check your Downloads folder.`,
          isError: false,
        });
      } else {
        setExportStatus({
          msg: result.error || 'Failed to export backup file.',
          isError: true,
        });
      }
    } catch (err: any) {
      setExportStatus({
        msg: err?.message || 'An unexpected error occurred during export.',
        isError: true,
      });
    }
    setTimeout(() => setExportStatus(null), 5000);
  };

  const handleConfirmReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    setName('Naga Sri');
    setEducation('B.Tech, 2nd Year');
    setBranch('CSE — Artificial Intelligence & Data Science');
    setCollege('JNTUK');
    setDailyGoalMinutes('60');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          <Settings className="h-4 w-4" />
          <span>App Preferences & Data Storage</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Customize your academic profile, study targets, theme, and create local backups.
        </p>
      </div>

      {/* Student Profile Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Student Profile & College Context
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Student Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Education Level
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Branch / Specialization
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Daily Study Goal (Minutes)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="15"
                  max="360"
                  required
                  value={dailyGoalMinutes}
                  onChange={(e) => setDailyGoalMinutes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <span className="text-xs text-slate-500 shrink-0">min / day</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Learning Language Preference
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as LanguageOption)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Bilingual">Bilingual (English + Telugu)</option>
                <option value="English">English</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Primary Career Goal
            </label>
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            {saveSuccessMsg ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Profile updated successfully!
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Theme Selection */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Interface Appearance
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Choose a visual theme designed for comfortable long study sessions.
        </p>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-medium transition-colors ${
              theme === 'light'
                ? 'border-teal-600 bg-teal-50/50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
            }`}
          >
            <Sun className="h-5 w-5" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-medium transition-colors ${
              theme === 'dark'
                ? 'border-teal-600 bg-teal-50/50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
            }`}
          >
            <Moon className="h-5 w-5" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-medium transition-colors ${
              theme === 'system'
                ? 'border-teal-600 bg-teal-50/50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
            }`}
          >
            <Laptop className="h-5 w-5" />
            <span>System Default</span>
          </button>
        </div>
      </div>

      {/* Data Backup, Import & Privacy */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Data Persistence & Local Storage
          </h2>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 dark:border-blue-950 dark:bg-blue-950/40 dark:text-blue-200 flex items-start gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold">Local-First Storage Notice:</span>
            <p className="leading-relaxed">
              DataPath stores all your study timer sessions, streak calendar qualifying days, semester topics, and internship applications directly inside your browser’s localStorage. It is strictly private to your browser/device and requires no login.
            </p>
            <p className="leading-relaxed">
              If you clear browser cookies or site data, this stored progress will be removed. We recommend exporting a JSON backup periodically so you can restore your data anytime.
            </p>
          </div>
        </div>

        {importStatus && (
          <div
            className={`rounded-xl p-3.5 text-xs font-medium ${
              importStatus.isError
                ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/50 dark:text-red-300'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
            }`}
          >
            {importStatus.msg}
          </div>
        )}

        {exportStatus && (
          <div
            className={`rounded-xl p-3.5 text-xs font-medium flex items-center gap-2 ${
              exportStatus.isError
                ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/50 dark:text-red-300'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
            }`}
          >
            {exportStatus.isError ? (
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            )}
            <span>{exportStatus.msg}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Backup (JSON)
          </button>

          <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <Upload className="h-4 w-4" />
            Import Backup
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 ml-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All Data
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset All Learning Data?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This will permanently delete all your recorded study timer sessions, streaks, custom semester subjects, and internship applications from this browser. This action cannot be undone unless you have exported a JSON backup.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
