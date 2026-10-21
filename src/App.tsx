import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { DailyStudyTimerView } from './components/timer/DailyStudyTimerView';
import { StreakCalendarView } from './components/streak/StreakCalendarView';
import { StudyPlanView } from './components/roadmap/StudyPlanView';
import { RoadmapVisualView } from './components/roadmap/RoadmapVisualView';
import { SemesterSubjectsView } from './components/semester/SemesterSubjectsView';
import { LearningResourcesView } from './components/resources/LearningResourcesView';
import { ProjectsTrackerView } from './components/projects/ProjectsTrackerView';
import { InternshipPrepView } from './components/internship/InternshipPrepView';
import { DailyStudyLogView } from './components/logs/DailyStudyLogView';
import { SettingsView } from './components/settings/SettingsView';
import { CelebrationModal } from './components/common/CelebrationModal';

const AppContent: React.FC = () => {
  const { currentTab } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'study-plan':
        return <StudyPlanView />;
      case 'semester':
        return <SemesterSubjectsView />;
      case 'timer':
        return <DailyStudyTimerView />;
      case 'streak':
        return <StreakCalendarView />;
      case 'roadmap':
        return <RoadmapVisualView />;
      case 'resources':
        return <LearningResourcesView />;
      case 'projects':
        return <ProjectsTrackerView />;
      case 'internship':
        return <InternshipPrepView />;
      case 'study-log':
        return <DailyStudyLogView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveTab()}
        </main>
      </div>

      {/* Global Milestone Celebration Modal */}
      <CelebrationModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
