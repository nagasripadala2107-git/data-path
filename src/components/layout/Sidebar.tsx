import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck2,
  BookOpen,
  Timer,
  Flame,
  Milestone,
  Library,
  FolderGit2,
  Briefcase,
  History,
  Settings,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { currentTab, setCurrentTab, activeTimer, streakStats, userProfile, sessions } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'study-plan', label: 'My Study Plan', icon: CalendarCheck2 },
    { id: 'semester', label: 'Semester Subjects', icon: BookOpen },
    {
      id: 'timer',
      label: 'Daily Study Timer',
      icon: Timer,
      badge: activeTimer.isRunning ? 'Active' : undefined,
    },
    {
      id: 'streak',
      label: 'Streak Calendar',
      icon: Flame,
      badge: streakStats.currentStreak > 0 ? `${streakStats.currentStreak}d` : undefined,
    },
    { id: 'roadmap', label: 'DE Roadmap', icon: Milestone },
    { id: 'resources', label: 'Learning Resources', icon: Library },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'internship', label: 'Internship Prep', icon: Briefcase },
    {
      id: 'study-log',
      label: 'Daily Study Log',
      icon: History,
      badge: sessions.length > 0 ? sessions.length : undefined,
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-sm shadow-xs">
            DP
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              DataPath
            </span>
            <span className="text-[10px] text-teal-700 dark:text-teal-400 font-medium tracking-wide">
              B.Tech AIDS → Data Engineer
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive
                        ? 'bg-teal-200/60 text-teal-900 dark:bg-teal-900 dark:text-teal-200'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Student Profile Footer Badge */}
        <div className="border-t border-slate-200 p-3.5 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                {userProfile.name}
              </span>
              <span className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                {userProfile.education} · {userProfile.college}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
