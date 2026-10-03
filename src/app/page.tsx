'use client';

import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { TaskModal } from '@/components/tasks/TaskModal';
import { QuickAddModal } from '@/components/tasks/QuickAddModal';
import { FocusModeModal } from '@/components/tasks/FocusModeModal';

import { WorkSpaceView } from '@/components/views/WorkSpaceView';
import { MeetingNotesView } from '@/components/views/MeetingNotesView';
import { TodaysTasksView } from '@/components/views/TodaysTasksView';
import { WeeklyTasksView } from '@/components/views/WeeklyTasksView';
import { MonthlyTasksView } from '@/components/views/MonthlyTasksView';
import { CalendarView } from '@/components/views/CalendarView';
import { CompletedTasksView } from '@/components/views/CompletedTasksView';
import { SettingsView } from '@/components/views/SettingsView';

export default function Home() {
  const { activeView } = useTaskContext();

  const renderActiveView = () => {
    switch (activeView) {
      case 'workspace':
        return <WorkSpaceView />;
      case 'meeting-notes':
        return <MeetingNotesView />;
      case 'todays-tasks':
        return <TodaysTasksView />;
      case 'weekly-tasks':
        return <WeeklyTasksView />;
      case 'monthly-tasks':
        return <MonthlyTasksView />;
      case 'calendar':
        return <CalendarView />;
      case 'completed-tasks':
        return <CompletedTasksView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <WorkSpaceView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal />
      <QuickAddModal />
      <FocusModeModal />
    </div>
  );
}
