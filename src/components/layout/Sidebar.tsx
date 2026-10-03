'use client';

import React from 'react';
import {
  CalendarDays,
  Clock,
  Calendar,
  CheckCircle2,
  Settings,
  Plus,
  Moon,
  Sun,
  Zap,
  Sparkles,
  FileText
} from 'lucide-react';
import { useTaskContext, ViewType } from '@/context/TaskContext';

export const Sidebar = () => {
  const {
    activeView,
    setActiveView,
    openTaskModal,
    tasks,
    settings,
    updateSettings,
    stats,
    carryForwardUnfinishedTasks
  } = useTaskContext();

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysCount = tasks.filter((t) => t.dueDate === todayStr && t.status !== 'Done').length;
  const upcomingCount = tasks.filter((t) => t.dueDate > todayStr && t.status !== 'Done').length;

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'workspace', label: 'Work Space & Notes', icon: <Zap className="w-5 h-5" /> },
    { id: 'meeting-notes', label: 'Meeting Notes', icon: <FileText className="w-5 h-5" /> },
    { id: 'todays-tasks', label: "Today's Tasks", icon: <CalendarDays className="w-5 h-5" />, badge: todaysCount },
    { id: 'weekly-tasks', label: 'Weekly Tasks', icon: <Clock className="w-5 h-5" />, badge: upcomingCount },
    { id: 'monthly-tasks', label: 'Monthly Tasks', icon: <Calendar className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar Grid', icon: <Calendar className="w-5 h-5" /> },
    { id: 'completed-tasks', label: 'Completed Tasks', icon: <CheckCircle2 className="w-5 h-5" />, badge: stats.completedTasks },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-colors z-20 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-black dark:text-white tracking-tight leading-none">
              MyTaskFlow
            </h1>
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Personal Task Manager
            </span>
          </div>
        </div>
      </div>

      {/* Quick Add Action Button */}
      <div className="p-4">
        <button
          onClick={() => openTaskModal()}
          className="w-full py-2.5 px-4 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Personal Tasks
        </div>

        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white dark:text-black' : 'text-zinc-500 dark:text-zinc-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Carry Forward Quick Banner */}
      {stats.overdueTasks > 0 && (
        <div className="p-3 mx-3 my-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-zinc-900 dark:text-zinc-100 font-bold">
            <Sparkles className="w-4 h-4 shrink-0 text-zinc-700 dark:text-zinc-300" />
            <span>{stats.overdueTasks} unfinished tasks</span>
          </div>
          <button
            onClick={carryForwardUnfinishedTasks}
            className="w-full py-1.5 px-2 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
          >
            Carry Forward to Today
          </button>
        </div>
      )}

      {/* Footer / Theme Toggle */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="truncate">
          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
            {settings.userName}
          </p>
          <p className="text-[10px] text-slate-400 truncate">Personal Workspace</p>
        </div>

        <button
          onClick={toggleTheme}
          title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </aside>
  );
};
