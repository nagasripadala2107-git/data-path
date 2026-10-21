import {
  UserProfile,
  StudySession,
  ActiveTimerState,
  RoadmapWeek,
  SemesterSubject,
  LearningResource,
  PortfolioProject,
  InternshipApplication,
  ChecklistItem,
  PracticeProblem,
  DailyStudyLogEntry,
  RevisionPlanItem,
} from '../types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_ROADMAP_WEEKS,
  INITIAL_SEMESTER_SUBJECTS,
  INITIAL_LEARNING_RESOURCES,
  INITIAL_PROJECTS,
  INITIAL_RESUME_CHECKLIST,
  INITIAL_GITHUB_CHECKLIST,
  INITIAL_PRACTICE_PROBLEMS,
} from '../data/initialData';
import { getLocalDateString } from './dateUtils';

export interface AppStoredState {
  version: number;
  userProfile: UserProfile;
  sessions: StudySession[];
  activeTimer: ActiveTimerState;
  roadmapWeeks: RoadmapWeek[];
  semesterSubjects: SemesterSubject[];
  revisionPlan: RevisionPlanItem[];
  resources: LearningResource[];
  projects: PortfolioProject[];
  applications: InternshipApplication[];
  resumeChecklist: ChecklistItem[];
  githubChecklist: ChecklistItem[];
  practiceProblems: PracticeProblem[];
  dailyStudyLogs: DailyStudyLogEntry[];
  achievedMilestones: number[]; // e.g. [3, 7, 14, 30] to prevent repeating celebration on refresh
  theme: 'light' | 'dark' | 'system';
}

const STORAGE_KEY = 'datapath_learning_state_v1';

export const DEFAULT_ACTIVE_TIMER: ActiveTimerState = {
  isRunning: false,
  isPaused: false,
  startTime: null,
  accumulatedMs: 0,
  category: 'roadmap',
  topicOrSubject: 'Week 1: Python Fundamentals',
  notes: '',
  initialStartDate: null,
};

export const DEFAULT_STATE: AppStoredState = {
  version: 1,
  userProfile: INITIAL_USER_PROFILE,
  sessions: [], // Empty initially: no fabricated study sessions
  activeTimer: DEFAULT_ACTIVE_TIMER,
  roadmapWeeks: INITIAL_ROADMAP_WEEKS,
  semesterSubjects: INITIAL_SEMESTER_SUBJECTS,
  revisionPlan: [],
  resources: INITIAL_LEARNING_RESOURCES,
  projects: INITIAL_PROJECTS,
  applications: [], // Empty initially: no fabricated applications
  resumeChecklist: INITIAL_RESUME_CHECKLIST,
  githubChecklist: INITIAL_GITHUB_CHECKLIST,
  practiceProblems: INITIAL_PRACTICE_PROBLEMS,
  dailyStudyLogs: [],
  achievedMilestones: [],
  theme: 'light',
};

export function loadStoredState(): AppStoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_STATE;

    return {
      version: parsed.version || 1,
      userProfile: { ...DEFAULT_STATE.userProfile, ...(parsed.userProfile || {}) },
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      activeTimer: parsed.activeTimer ? { ...DEFAULT_ACTIVE_TIMER, ...parsed.activeTimer } : DEFAULT_ACTIVE_TIMER,
      roadmapWeeks: Array.isArray(parsed.roadmapWeeks) ? parsed.roadmapWeeks : INITIAL_ROADMAP_WEEKS,
      semesterSubjects: Array.isArray(parsed.semesterSubjects) ? parsed.semesterSubjects : INITIAL_SEMESTER_SUBJECTS,
      revisionPlan: Array.isArray(parsed.revisionPlan) ? parsed.revisionPlan : [],
      resources: Array.isArray(parsed.resources) ? parsed.resources : INITIAL_LEARNING_RESOURCES,
      projects: Array.isArray(parsed.projects) ? parsed.projects : INITIAL_PROJECTS,
      applications: Array.isArray(parsed.applications) ? parsed.applications : [],
      resumeChecklist: Array.isArray(parsed.resumeChecklist) ? parsed.resumeChecklist : INITIAL_RESUME_CHECKLIST,
      githubChecklist: Array.isArray(parsed.githubChecklist) ? parsed.githubChecklist : INITIAL_GITHUB_CHECKLIST,
      practiceProblems: Array.isArray(parsed.practiceProblems) ? parsed.practiceProblems : INITIAL_PRACTICE_PROBLEMS,
      dailyStudyLogs: Array.isArray(parsed.dailyStudyLogs) ? parsed.dailyStudyLogs : [],
      achievedMilestones: Array.isArray(parsed.achievedMilestones) ? parsed.achievedMilestones : [],
      theme: parsed.theme === 'dark' || parsed.theme === 'light' || parsed.theme === 'system' ? parsed.theme : 'light',
    };
  } catch (err) {
    console.error('Failed to load local state from localStorage:', err);
    return DEFAULT_STATE;
  }
}

export function saveStoredState(state: AppStoredState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export interface ExportResult {
  success: boolean;
  filename: string;
  error?: string;
}

export function exportStateToJson(state: AppStoredState): ExportResult {
  try {
    const dateStr = getLocalDateString();
    const filename = `datapath-backup-${dateStr}.json`;
    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);

    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = objectUrl;
    downloadAnchor.download = filename;
    downloadAnchor.style.display = 'none';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    setTimeout(() => {
      if (downloadAnchor.parentNode) {
        downloadAnchor.parentNode.removeChild(downloadAnchor);
      }
      URL.revokeObjectURL(objectUrl);
    }, 500);

    return { success: true, filename };
  } catch (err: any) {
    console.error('Failed to export state to JSON:', err);
    return {
      success: false,
      filename: '',
      error: err?.message || 'Failed to generate downloadable JSON backup file.',
    };
  }
}

export function validateImportedJson(jsonObj: any): { valid: boolean; error?: string; state?: AppStoredState } {
  if (!jsonObj || typeof jsonObj !== 'object') {
    return { valid: false, error: 'The uploaded file is not a valid JSON object.' };
  }
  if (!jsonObj.version && !jsonObj.roadmapWeeks && !jsonObj.userProfile) {
    return { valid: false, error: 'The uploaded file does not match DataPath backup structure.' };
  }

  const restored: AppStoredState = {
    version: 1,
    userProfile: jsonObj.userProfile || DEFAULT_STATE.userProfile,
    sessions: Array.isArray(jsonObj.sessions) ? jsonObj.sessions : [],
    activeTimer: DEFAULT_ACTIVE_TIMER,
    roadmapWeeks: Array.isArray(jsonObj.roadmapWeeks) ? jsonObj.roadmapWeeks : INITIAL_ROADMAP_WEEKS,
    semesterSubjects: Array.isArray(jsonObj.semesterSubjects) ? jsonObj.semesterSubjects : INITIAL_SEMESTER_SUBJECTS,
    revisionPlan: Array.isArray(jsonObj.revisionPlan) ? jsonObj.revisionPlan : [],
    resources: Array.isArray(jsonObj.resources) ? jsonObj.resources : INITIAL_LEARNING_RESOURCES,
    projects: Array.isArray(jsonObj.projects) ? jsonObj.projects : INITIAL_PROJECTS,
    applications: Array.isArray(jsonObj.applications) ? jsonObj.applications : [],
    resumeChecklist: Array.isArray(jsonObj.resumeChecklist) ? jsonObj.resumeChecklist : INITIAL_RESUME_CHECKLIST,
    githubChecklist: Array.isArray(jsonObj.githubChecklist) ? jsonObj.githubChecklist : INITIAL_GITHUB_CHECKLIST,
    practiceProblems: Array.isArray(jsonObj.practiceProblems) ? jsonObj.practiceProblems : INITIAL_PRACTICE_PROBLEMS,
    dailyStudyLogs: Array.isArray(jsonObj.dailyStudyLogs) ? jsonObj.dailyStudyLogs : [],
    achievedMilestones: Array.isArray(jsonObj.achievedMilestones) ? jsonObj.achievedMilestones : [],
    theme: jsonObj.theme === 'dark' || jsonObj.theme === 'light' ? jsonObj.theme : 'light',
  };

  return { valid: true, state: restored };
}

export function clearAllStoredData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
}
