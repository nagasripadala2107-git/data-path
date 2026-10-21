/**
 * Core domain types for DataPath - My Data Engineering Journey
 */

export type LanguageOption = 'English' | 'Telugu' | 'Bilingual';

export interface UserProfile {
  name: string;
  education: string; // e.g. "B.Tech, 2nd Year"
  branch: string; // e.g. "CSE - AI & Data Science"
  college: string; // e.g. "JNTUK"
  careerGoal: string; // e.g. "Data Engineer & Internship"
  dailyGoalMinutes: number; // default 60
  preferredLanguage: LanguageOption;
  joinedDate: string; // YYYY-MM-DD
}

export type SessionType = 'timer' | 'manual';
export type StudyCategory = 'roadmap' | 'semester' | 'project' | 'interview' | 'other';

export interface StudySession {
  id: string;
  date: string; // Local YYYY-MM-DD
  startTime: number; // timestamp ms
  endTime: number; // timestamp ms
  durationMinutes: number; // calculated rounded minutes or float
  durationSeconds: number; // exact seconds
  type: SessionType;
  category: StudyCategory;
  topicOrSubject: string; // e.g. "SQL Joins" or "DBMS Unit 2"
  notes?: string;
  createdAt: number;
}

export interface ActiveTimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: number | null; // ms timestamp when current segment started
  accumulatedMs: number; // ms accumulated before current segment
  category: StudyCategory;
  topicOrSubject: string;
  notes: string;
  initialStartDate: string | null; // local date when session was started
}

export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
  practicalExercise?: string;
  notes?: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  phaseId: number;
  title: string;
  description: string;
  objectives: string[];
  tasks: RoadmapTask[];
  isAdvancedExposure?: boolean;
}

export interface RoadmapPhase {
  id: number;
  title: string;
  weeksRange: string;
  description: string;
}

export interface SemesterTopic {
  id: string;
  title: string;
  isCompleted: boolean;
  isImportant: boolean;
  revisionCount: number;
  lastRevised?: string;
}

export interface SemesterUnit {
  id: string;
  unitNumber: number;
  title: string;
  topics: SemesterTopic[];
}

export interface SemesterSubject {
  id: string;
  code: string;
  name: string;
  credits?: number;
  examDate?: string;
  targetScore?: string;
  priority: 'High' | 'Medium' | 'Low';
  units: SemesterUnit[];
}

export interface RevisionPlanItem {
  id: string;
  subjectId: string;
  weekNumber: 1 | 2 | 3 | 4;
  topic: string;
  completed: boolean;
  targetDate: string;
}

export type ResourceType = 'documentation' | 'video' | 'course' | 'practice';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LearningResource {
  id: string;
  title: string;
  topic: string;
  language: 'English' | 'Telugu';
  type: ResourceType;
  difficulty: DifficultyLevel;
  description: string;
  url: string;
  isCompleted: boolean;
  isBookmarked: boolean;
  isUserAdded?: boolean;
}

export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate';
  status: ProjectStatus;
  description: string;
  objectives: string[];
  skillsPracticed: string[];
  tasks: ProjectTask[];
  startDate?: string;
  targetCompletionDate?: string;
  githubUrl: string;
  notes: string;
}

export type ApplicationStatus =
  | 'Interested'
  | 'Preparing'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export interface InternshipApplication {
  id: string;
  companyName: string;
  role: string;
  applicationUrl: string;
  dateApplied: string;
  status: ApplicationStatus;
  followUpDate?: string;
  notes: string;
  contactPerson?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  notes?: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  url?: string;
  notes?: string;
}

export interface DailyStudyLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  category: StudyCategory;
  subjectOrTopic: string;
  whatILearned: string;
  challenges: string;
  nextStep: string;
  notes?: string;
  isManualEntry: boolean;
  sessionId?: string;
  createdAt: number;
}

export interface StreakMilestone {
  days: number;
  title: string;
  description: string;
  iconName: string;
}

export type NavigationTab =
  | 'dashboard'
  | 'study-plan'
  | 'semester'
  | 'timer'
  | 'streak'
  | 'roadmap'
  | 'resources'
  | 'projects'
  | 'internship'
  | 'study-log'
  | 'settings';
