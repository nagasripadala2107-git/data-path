import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import confetti from 'canvas-confetti';
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
  NavigationTab,
  StudyCategory,
} from '../types';
import {
  loadStoredState,
  saveStoredState,
  DEFAULT_ACTIVE_TIMER,
  DEFAULT_STATE,
  AppStoredState,
  exportStateToJson,
  ExportResult,
  validateImportedJson,
  clearAllStoredData,
} from '../utils/storage';
import {
  getLocalDateString,
  calculateStreakStats,
  splitSessionAcrossMidnight,
  StreakStats,
} from '../utils/dateUtils';

interface CelebrationPayload {
  title: string;
  message: string;
  type: 'daily_goal' | 'streak_milestone';
  badgeName?: string;
}

interface AppContextValue {
  // Navigation & Theme
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Timer & Sessions
  activeTimer: ActiveTimerState;
  currentElapsedSeconds: number;
  startTimer: (category?: StudyCategory, topicOrSubject?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  completeTimerSession: (notes?: string) => void;
  resetTimer: () => void;
  updateTimerMeta: (fields: Partial<Pick<ActiveTimerState, 'category' | 'topicOrSubject' | 'notes'>>) => void;

  // Study Sessions & Manual Logs
  sessions: StudySession[];
  dailyStudyLogs: DailyStudyLogEntry[];
  addManualStudySession: (entry: {
    date: string;
    durationMinutes: number;
    category: StudyCategory;
    topicOrSubject: string;
    whatILearned: string;
    challenges?: string;
    nextStep?: string;
    notes?: string;
  }) => void;
  deleteSession: (id: string) => void;

  // Streaks & Goals
  streakStats: StreakStats;
  celebrationModal: CelebrationPayload | null;
  dismissCelebration: () => void;

  // Roadmap
  roadmapWeeks: RoadmapWeek[];
  toggleRoadmapTask: (weekNumber: number, taskId: string) => void;
  updateRoadmapTaskNotes: (weekNumber: number, taskId: string, notes: string) => void;

  // Semester Subjects
  semesterSubjects: SemesterSubject[];
  addSemesterSubject: (subject: Omit<SemesterSubject, 'id'>) => void;
  updateSemesterSubject: (id: string, updates: Partial<SemesterSubject>) => void;
  deleteSemesterSubject: (id: string) => void;
  toggleSemesterTopic: (subjectId: string, unitId: string, topicId: string) => void;
  incrementTopicRevision: (subjectId: string, unitId: string, topicId: string) => void;
  addSemesterUnit: (subjectId: string, title: string) => void;
  addSemesterTopic: (subjectId: string, unitId: string, title: string, isImportant: boolean) => void;
  deleteSemesterTopic: (subjectId: string, unitId: string, topicId: string) => void;

  // Revision Planner
  revisionPlan: RevisionPlanItem[];
  addRevisionPlanItem: (item: Omit<RevisionPlanItem, 'id'>) => void;
  toggleRevisionPlanItem: (id: string) => void;
  deleteRevisionPlanItem: (id: string) => void;

  // Resources
  resources: LearningResource[];
  addResource: (resource: Omit<LearningResource, 'id'>) => void;
  toggleBookmarkResource: (id: string) => void;
  toggleCompleteResource: (id: string) => void;
  deleteResource: (id: string) => void;

  // Projects
  projects: PortfolioProject[];
  updateProject: (id: string, updates: Partial<PortfolioProject>) => void;
  toggleProjectTask: (projectId: string, taskId: string) => void;
  addProject: (project: Omit<PortfolioProject, 'id'>) => void;

  // Internship Prep
  applications: InternshipApplication[];
  addApplication: (app: Omit<InternshipApplication, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<InternshipApplication>) => void;
  deleteApplication: (id: string) => void;

  resumeChecklist: ChecklistItem[];
  toggleResumeItem: (id: string) => void;
  githubChecklist: ChecklistItem[];
  toggleGithubItem: (id: string) => void;
  practiceProblems: PracticeProblem[];
  togglePracticeProblem: (id: string) => void;
  addPracticeProblem: (prob: Omit<PracticeProblem, 'id'>) => void;

  // Storage Operations
  exportBackup: () => ExportResult;
  importBackup: (file: File) => Promise<{ success: boolean; message: string }>;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppStoredState>(() => loadStoredState());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [celebrationModal, setCelebrationModal] = useState<CelebrationPayload | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  // Save state to localStorage on modification
  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  // Synchronize dark theme class with DOM
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      state.theme === 'dark' ||
      (state.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  // High-accuracy timer tick loop (only runs when active timer is running and not paused)
  useEffect(() => {
    if (!state.activeTimer.isRunning || state.activeTimer.isPaused) {
      return;
    }
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 500); // 500ms ensures smooth UI without clock drift
    return () => clearInterval(interval);
  }, [state.activeTimer.isRunning, state.activeTimer.isPaused]);

  // Compute live elapsed seconds for active timer using timestamps
  const currentElapsedSeconds = useMemo(() => {
    const { isRunning, isPaused, startTime, accumulatedMs } = state.activeTimer;
    if (!isRunning) return Math.floor(accumulatedMs / 1000);
    if (isPaused || !startTime) return Math.floor(accumulatedMs / 1000);
    const delta = Math.max(0, now - startTime);
    return Math.floor((accumulatedMs + delta) / 1000);
  }, [state.activeTimer, now]);

  // Compute streak stats dynamically from completed sessions and daily goal
  const streakStats = useMemo(() => {
    return calculateStreakStats(state.sessions, state.userProfile.dailyGoalMinutes);
  }, [state.sessions, state.userProfile.dailyGoalMinutes]);

  // Check for goal completion celebration & milestone achievements
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0D9488', '#0284C7', '#F59E0B', '#10B981'],
      });
    } catch {
      // safe fallback if canvas is unavailable
    }
  }, []);

  // Monitor newly reached streak milestones
  useEffect(() => {
    const { currentStreak, todayGoalMet } = streakStats;
    const achieved = state.achievedMilestones;

    // Check milestones (3, 7, 14, 30 days)
    const milestones = [
      { days: 3, title: '3-Day Consistency Spark!', desc: '3 consecutive days studying Data Engineering!' },
      { days: 7, title: '1-Week Data Warrior!', desc: '7 days in a row! Momentum is building steadily.' },
      { days: 14, title: '2-Week Pipeline Master!', desc: '14 consecutive qualifying days! Outstanding dedication.' },
      { days: 30, title: '1-Month Data Engineering Habit!', desc: '30 days! You have built a rock-solid learning habit.' },
    ];

    for (const m of milestones) {
      if (currentStreak >= m.days && !achieved.includes(m.days)) {
        setState((prev) => ({
          ...prev,
          achievedMilestones: [...prev.achievedMilestones, m.days],
        }));
        setCelebrationModal({
          title: m.title,
          message: m.desc,
          type: 'streak_milestone',
          badgeName: `${m.days}-Day Badge`,
        });
        triggerConfetti();
        return;
      }
    }

    // Check daily 60-min goal celebration for today if not already shown today
    const todayStr = getLocalDateString();
    const todayGoalKey = `goal_${todayStr}`;
    const goalCelebratedKey = 'datapath_last_celebrated_goal_date';
    const lastCelebrated = localStorage.getItem(goalCelebratedKey);

    if (todayGoalMet && lastCelebrated !== todayStr) {
      localStorage.setItem(goalCelebratedKey, todayStr);
      setCelebrationModal({
        title: 'Daily Goal Achieved! (60 Minutes)',
        message: 'Great job completing your 60-minute Data Engineering target for today. Keep this momentum going!',
        type: 'daily_goal',
      });
      triggerConfetti();
    }
  }, [streakStats, state.achievedMilestones, triggerConfetti]);

  // Timer controls
  const startTimer = useCallback(
    (category: StudyCategory = 'roadmap', topicOrSubject: string = 'Week 1: Python Fundamentals') => {
      const currentTime = Date.now();
      const localDate = getLocalDateString(new Date(currentTime));
      setState((prev) => ({
        ...prev,
        activeTimer: {
          isRunning: true,
          isPaused: false,
          startTime: currentTime,
          accumulatedMs: prev.activeTimer.isRunning ? prev.activeTimer.accumulatedMs : 0,
          category,
          topicOrSubject,
          notes: prev.activeTimer.notes || '',
          initialStartDate: prev.activeTimer.initialStartDate || localDate,
        },
      }));
    },
    []
  );

  const pauseTimer = useCallback(() => {
    const currentTime = Date.now();
    setState((prev) => {
      if (!prev.activeTimer.isRunning || prev.activeTimer.isPaused || !prev.activeTimer.startTime) {
        return prev;
      }
      const addedMs = Math.max(0, currentTime - prev.activeTimer.startTime);
      return {
        ...prev,
        activeTimer: {
          ...prev.activeTimer,
          isPaused: true,
          startTime: null,
          accumulatedMs: prev.activeTimer.accumulatedMs + addedMs,
        },
      };
    });
  }, []);

  const resumeTimer = useCallback(() => {
    const currentTime = Date.now();
    setState((prev) => {
      if (!prev.activeTimer.isRunning || !prev.activeTimer.isPaused) {
        return prev;
      }
      return {
        ...prev,
        activeTimer: {
          ...prev.activeTimer,
          isPaused: false,
          startTime: currentTime,
        },
      };
    });
  }, []);

  const updateTimerMeta = useCallback(
    (fields: Partial<Pick<ActiveTimerState, 'category' | 'topicOrSubject' | 'notes'>>) => {
      setState((prev) => ({
        ...prev,
        activeTimer: {
          ...prev.activeTimer,
          ...fields,
        },
      }));
    },
    []
  );

  const resetTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeTimer: {
        ...DEFAULT_ACTIVE_TIMER,
        topicOrSubject: prev.activeTimer.topicOrSubject,
        category: prev.activeTimer.category,
      },
    }));
  }, []);

  const completeTimerSession = useCallback(
    (overrideNotes?: string) => {
      const currentTime = Date.now();
      setState((prev) => {
        const { isRunning, isPaused, startTime, accumulatedMs, category, topicOrSubject, notes } =
          prev.activeTimer;

        let totalMs = accumulatedMs;
        if (isRunning && !isPaused && startTime) {
          totalMs += Math.max(0, currentTime - startTime);
        }

        const totalSeconds = Math.floor(totalMs / 1000);
        // Only record if study duration is at least 5 seconds
        if (totalSeconds < 5) {
          return {
            ...prev,
            activeTimer: DEFAULT_ACTIVE_TIMER,
          };
        }

        const effectiveNotes = overrideNotes !== undefined ? overrideNotes : notes;
        const sessionStartTime = currentTime - totalMs;
        const sessionEndTime = currentTime;

        // Split across midnight if the timer crossed midnight
        const daySplits = splitSessionAcrossMidnight(sessionStartTime, sessionEndTime);
        const newSessions: StudySession[] = [];
        const newLogs: DailyStudyLogEntry[] = [];

        daySplits.forEach((split, index) => {
          const durationMins = Number((split.durationSeconds / 60).toFixed(1));
          const sessionId = `sess-${Date.now()}-${index}`;

          const session: StudySession = {
            id: sessionId,
            date: split.date,
            startTime: split.startTime,
            endTime: split.endTime,
            durationMinutes: durationMins,
            durationSeconds: split.durationSeconds,
            type: 'timer',
            category,
            topicOrSubject,
            notes: effectiveNotes,
            createdAt: Date.now(),
          };

          const log: DailyStudyLogEntry = {
            id: `log-${Date.now()}-${index}`,
            date: split.date,
            durationMinutes: durationMins,
            category,
            subjectOrTopic: topicOrSubject,
            whatILearned: effectiveNotes || `Completed focused study session on ${topicOrSubject}.`,
            challenges: '',
            nextStep: 'Continue next module/practice exercises.',
            notes: effectiveNotes,
            isManualEntry: false,
            sessionId,
            createdAt: Date.now(),
          };

          newSessions.push(session);
          newLogs.push(log);
        });

        return {
          ...prev,
          sessions: [...prev.sessions, ...newSessions],
          dailyStudyLogs: [...newLogs, ...prev.dailyStudyLogs],
          activeTimer: DEFAULT_ACTIVE_TIMER,
        };
      });
    },
    []
  );

  // Manual study session addition
  const addManualStudySession = useCallback(
    (entry: {
      date: string;
      durationMinutes: number;
      category: StudyCategory;
      topicOrSubject: string;
      whatILearned: string;
      challenges?: string;
      nextStep?: string;
      notes?: string;
    }) => {
      const sessionId = `manual-sess-${Date.now()}`;
      const logId = `manual-log-${Date.now()}`;
      const durationSeconds = Math.round(entry.durationMinutes * 60);

      const newSession: StudySession = {
        id: sessionId,
        date: entry.date,
        startTime: Date.now() - durationSeconds * 1000,
        endTime: Date.now(),
        durationMinutes: entry.durationMinutes,
        durationSeconds,
        type: 'manual',
        category: entry.category,
        topicOrSubject: entry.topicOrSubject,
        notes: entry.notes || entry.whatILearned,
        createdAt: Date.now(),
      };

      const newLog: DailyStudyLogEntry = {
        id: logId,
        date: entry.date,
        durationMinutes: entry.durationMinutes,
        category: entry.category,
        subjectOrTopic: entry.topicOrSubject,
        whatILearned: entry.whatILearned,
        challenges: entry.challenges || '',
        nextStep: entry.nextStep || '',
        notes: entry.notes,
        isManualEntry: true,
        sessionId,
        createdAt: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        sessions: [...prev.sessions, newSession],
        dailyStudyLogs: [newLog, ...prev.dailyStudyLogs],
      }));
    },
    []
  );

  const deleteSession = useCallback((sessionId: string) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== sessionId),
      dailyStudyLogs: prev.dailyStudyLogs.filter((l) => l.sessionId !== sessionId && l.id !== sessionId),
    }));
  }, []);

  // User Profile
  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...profile },
    }));
  }, []);

  // Theme
  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    setState((prev) => ({ ...prev, theme }));
  }, []);

  // Roadmap tasks
  const toggleRoadmapTask = useCallback((weekNumber: number, taskId: string) => {
    setState((prev) => ({
      ...prev,
      roadmapWeeks: prev.roadmapWeeks.map((week) => {
        if (week.weekNumber !== weekNumber) return week;
        return {
          ...week,
          tasks: week.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return { ...task, completed: !task.completed };
          }),
        };
      }),
    }));
  }, []);

  const updateRoadmapTaskNotes = useCallback((weekNumber: number, taskId: string, notes: string) => {
    setState((prev) => ({
      ...prev,
      roadmapWeeks: prev.roadmapWeeks.map((week) => {
        if (week.weekNumber !== weekNumber) return week;
        return {
          ...week,
          tasks: week.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return { ...task, notes };
          }),
        };
      }),
    }));
  }, []);

  // Semester Subjects
  const addSemesterSubject = useCallback((subject: Omit<SemesterSubject, 'id'>) => {
    const newSub: SemesterSubject = {
      ...subject,
      id: `sub-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      semesterSubjects: [...prev.semesterSubjects, newSub],
    }));
  }, []);

  const updateSemesterSubject = useCallback((id: string, updates: Partial<SemesterSubject>) => {
    setState((prev) => ({
      ...prev,
      semesterSubjects: prev.semesterSubjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const deleteSemesterSubject = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      semesterSubjects: prev.semesterSubjects.filter((s) => s.id !== id),
    }));
  }, []);

  const toggleSemesterTopic = useCallback((subjectId: string, unitId: string, topicId: string) => {
    setState((prev) => ({
      ...prev,
      semesterSubjects: prev.semesterSubjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          units: sub.units.map((unit) => {
            if (unit.id !== unitId) return unit;
            return {
              ...unit,
              topics: unit.topics.map((top) => {
                if (top.id !== topicId) return top;
                return { ...top, isCompleted: !top.isCompleted };
              }),
            };
          }),
        };
      }),
    }));
  }, []);

  const incrementTopicRevision = useCallback((subjectId: string, unitId: string, topicId: string) => {
    const today = getLocalDateString();
    setState((prev) => ({
      ...prev,
      semesterSubjects: prev.semesterSubjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          units: sub.units.map((unit) => {
            if (unit.id !== unitId) return unit;
            return {
              ...unit,
              topics: unit.topics.map((top) => {
                if (top.id !== topicId) return top;
                return {
                  ...top,
                  revisionCount: (top.revisionCount || 0) + 1,
                  lastRevised: today,
                };
              }),
            };
          }),
        };
      }),
    }));
  }, []);

  const addSemesterUnit = useCallback((subjectId: string, title: string) => {
    setState((prev) => ({
      ...prev,
      semesterSubjects: prev.semesterSubjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const newUnit = {
          id: `u-${Date.now()}`,
          unitNumber: sub.units.length + 1,
          title,
          topics: [],
        };
        return {
          ...sub,
          units: [...sub.units, newUnit],
        };
      }),
    }));
  }, []);

  const addSemesterTopic = useCallback(
    (subjectId: string, unitId: string, title: string, isImportant: boolean) => {
      setState((prev) => ({
        ...prev,
        semesterSubjects: prev.semesterSubjects.map((sub) => {
          if (sub.id !== subjectId) return sub;
          return {
            ...sub,
            units: sub.units.map((unit) => {
              if (unit.id !== unitId) return unit;
              return {
                ...unit,
                topics: [
                  ...unit.topics,
                  {
                    id: `top-${Date.now()}`,
                    title,
                    isCompleted: false,
                    isImportant,
                    revisionCount: 0,
                  },
                ],
              };
            }),
          };
        }),
      }));
    },
    []
  );

  const deleteSemesterTopic = useCallback((subjectId: string, unitId: string, topicId: string) => {
    setState((prev) => ({
      ...prev,
      semesterSubjects: prev.semesterSubjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          units: sub.units.map((unit) => {
            if (unit.id !== unitId) return unit;
            return {
              ...unit,
              topics: unit.topics.filter((t) => t.id !== topicId),
            };
          }),
        };
      }),
    }));
  }, []);

  // Revision Planner
  const addRevisionPlanItem = useCallback((item: Omit<RevisionPlanItem, 'id'>) => {
    setState((prev) => ({
      ...prev,
      revisionPlan: [...prev.revisionPlan, { ...item, id: `rev-${Date.now()}` }],
    }));
  }, []);

  const toggleRevisionPlanItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      revisionPlan: prev.revisionPlan.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it)),
    }));
  }, []);

  const deleteRevisionPlanItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      revisionPlan: prev.revisionPlan.filter((it) => it.id !== id),
    }));
  }, []);

  // Resources
  const addResource = useCallback((resource: Omit<LearningResource, 'id'>) => {
    setState((prev) => ({
      ...prev,
      resources: [
        {
          ...resource,
          id: `res-${Date.now()}`,
          isUserAdded: true,
        },
        ...prev.resources,
      ],
    }));
  }, []);

  const toggleBookmarkResource = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      resources: prev.resources.map((r) => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r)),
    }));
  }, []);

  const toggleCompleteResource = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      resources: prev.resources.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r)),
    }));
  }, []);

  const deleteResource = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      resources: prev.resources.filter((r) => r.id !== id),
    }));
  }, []);

  // Projects
  const updateProject = useCallback((id: string, updates: Partial<PortfolioProject>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }, []);

  const toggleProjectTask = useCallback((projectId: string, taskId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        const newTasks = proj.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
        const allCompleted = newTasks.length > 0 && newTasks.every((t) => t.completed);
        const anyCompleted = newTasks.some((t) => t.completed);
        const status = allCompleted ? 'Completed' : anyCompleted ? 'In Progress' : 'Not Started';

        return {
          ...proj,
          tasks: newTasks,
          status,
        };
      }),
    }));
  }, []);

  const addProject = useCallback((project: Omit<PortfolioProject, 'id'>) => {
    setState((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: `proj-${Date.now()}` }],
    }));
  }, []);

  // Internship Prep
  const addApplication = useCallback((app: Omit<InternshipApplication, 'id'>) => {
    setState((prev) => ({
      ...prev,
      applications: [{ ...app, id: `app-${Date.now()}` }, ...prev.applications],
    }));
  }, []);

  const updateApplication = useCallback((id: string, updates: Partial<InternshipApplication>) => {
    setState((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  }, []);

  const deleteApplication = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      applications: prev.applications.filter((a) => a.id !== id),
    }));
  }, []);

  const toggleResumeItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      resumeChecklist: prev.resumeChecklist.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it)),
    }));
  }, []);

  const toggleGithubItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      githubChecklist: prev.githubChecklist.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it)),
    }));
  }, []);

  const togglePracticeProblem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      practiceProblems: prev.practiceProblems.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p)),
    }));
  }, []);

  const addPracticeProblem = useCallback((prob: Omit<PracticeProblem, 'id'>) => {
    setState((prev) => ({
      ...prev,
      practiceProblems: [...prev.practiceProblems, { ...prob, id: `pr-${Date.now()}` }],
    }));
  }, []);

  // Storage actions
  const exportBackup = useCallback((): ExportResult => {
    try {
      saveStoredState(state);
      return exportStateToJson(state);
    } catch (err: any) {
      console.error('Failed to export backup:', err);
      return {
        success: false,
        filename: '',
        error: err?.message || 'Failed to export backup file.',
      };
    }
  }, [state]);

  const importBackup = useCallback(async (file: File): Promise<{ success: boolean; message: string }> => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validation = validateImportedJson(parsed);
      if (!validation.valid || !validation.state) {
        return { success: false, message: validation.error || 'Invalid backup file structure.' };
      }
      setState(validation.state);
      return { success: true, message: 'Data backup restored successfully!' };
    } catch {
      return { success: false, message: 'Could not read or parse JSON file.' };
    }
  }, []);

  const resetAllData = useCallback(() => {
    clearAllStoredData();
    setState(DEFAULT_STATE);
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebrationModal(null);
  }, []);

  const value: AppContextValue = {
    currentTab,
    setCurrentTab,
    theme: state.theme,
    setTheme,
    userProfile: state.userProfile,
    updateUserProfile,
    activeTimer: state.activeTimer,
    currentElapsedSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    completeTimerSession,
    resetTimer,
    updateTimerMeta,
    sessions: state.sessions,
    dailyStudyLogs: state.dailyStudyLogs,
    addManualStudySession,
    deleteSession,
    streakStats,
    celebrationModal,
    dismissCelebration,
    roadmapWeeks: state.roadmapWeeks,
    toggleRoadmapTask,
    updateRoadmapTaskNotes,
    semesterSubjects: state.semesterSubjects,
    addSemesterSubject,
    updateSemesterSubject,
    deleteSemesterSubject,
    toggleSemesterTopic,
    incrementTopicRevision,
    addSemesterUnit,
    addSemesterTopic,
    deleteSemesterTopic,
    revisionPlan: state.revisionPlan,
    addRevisionPlanItem,
    toggleRevisionPlanItem,
    deleteRevisionPlanItem,
    resources: state.resources,
    addResource,
    toggleBookmarkResource,
    toggleCompleteResource,
    deleteResource,
    projects: state.projects,
    updateProject,
    toggleProjectTask,
    addProject,
    applications: state.applications,
    addApplication,
    updateApplication,
    deleteApplication,
    resumeChecklist: state.resumeChecklist,
    toggleResumeItem,
    githubChecklist: state.githubChecklist,
    toggleGithubItem,
    practiceProblems: state.practiceProblems,
    togglePracticeProblem,
    addPracticeProblem,
    exportBackup,
    importBackup,
    resetAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
