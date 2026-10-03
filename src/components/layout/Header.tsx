'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Target, Command } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { NotificationCenter } from './NotificationCenter';

export const Header = () => {
  const {
    activeView,
    filters,
    setFilters,
    openTaskModal,
    setIsQuickAddOpen,
    tasks,
    openFocusMode
  } = useTaskContext();

  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    setFormattedDate(
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  }, []);

  const getTitle = () => {
    switch (activeView) {
      case 'todays-tasks':
        return "Today's Personal Schedule";
      case 'weekly-tasks':
        return 'Weekly Personal Tasks';
      case 'monthly-tasks':
        return 'Monthly Personal Tasks';
      case 'completed-tasks':
        return 'Completed Tasks History';
      case 'settings':
        return 'Personal Settings';
      default:
        return "Today's Schedule";
    }
  };

  const highPriorityPendingTask = tasks.find((t) => t.priority === 'High' && t.status !== 'Done');

  return (
    <header className="sticky top-0 z-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between gap-4 transition-colors">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {getTitle()}
          </h2>
          {formattedDate && (
            <span
              suppressHydrationWarning
              className="hidden sm:inline-block px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-full border border-zinc-200 dark:border-zinc-700"
            >
              {formattedDate}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative w-48 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search personal tasks..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
          />
        </div>

        {/* Quick Add Ctrl+K */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs rounded-xl font-bold transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
          title="Quick Add Task (Ctrl+K)"
        >
          <Command className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
          <span>Ctrl+K</span>
        </button>

        {/* Focus Mode button */}
        {highPriorityPendingTask && (
          <button
            onClick={() => openFocusMode(highPriorityPendingTask)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
            title="Focus Mode"
          >
            <Target className="w-4 h-4 text-white dark:text-black animate-spin-slow" />
            <span>Focus Mode</span>
          </button>
        )}

        {/* Notification Bell */}
        <NotificationCenter />

        {/* Mobile Quick Add */}
        <button
          onClick={() => openTaskModal()}
          className="sm:hidden p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-xs cursor-pointer"
          title="Add Task"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
