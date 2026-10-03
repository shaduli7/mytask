'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Plus,
  CalendarDays,
  Target,
  ListTodo
} from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskCard } from '@/components/tasks/TaskCard';

export const DashboardView = () => {
  const {
    stats,
    tasks,
    settings,
    openTaskModal,
    addTask,
    carryForwardUnfinishedTasks,
    setActiveView
  } = useTaskContext();

  const [quickTitle, setQuickTitle] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter((t) => t.dueDate === todayStr);
  const overdueTasksList = tasks.filter((t) => t.dueDate < todayStr && t.status !== 'Done');

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addTask({
      title: quickTitle.trim(),
      category: 'Personal',
      priority: settings.defaultPriority || 'Medium',
      status: 'To Do',
      dueDate: todayStr,
      dueTime: '18:00',
      reminderDateTime: `${todayStr}T18:00`,
      recurring: 'None',
    });

    setQuickTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 text-white p-6 sm:p-8 shadow-xl shadow-purple-500/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{formattedDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, {settings.userName}! 👋
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              You have <span className="font-bold text-white">{todaysTasks.filter(t => t.status !== 'Done').length} personal tasks pending</span> for today. Keep up the momentum!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[240px] border border-white/15">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-100 mb-2">
              <span>Today's Completion</span>
              <span className="text-white text-sm font-bold">{stats.completionRatePercentage}%</span>
            </div>
            <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-300 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRatePercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-purple-200 mt-2 text-right">
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs transition-card">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Tasks</span>
            <ListTodo className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalTasks}</p>
          <span className="text-[10px] text-slate-400">All registered tasks</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs transition-card">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completedTasks}</p>
          <span className="text-[10px] text-slate-400">Finished tasks</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs transition-card">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
            <span className="text-xs font-medium">Pending</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{stats.pendingTasks}</p>
          <span className="text-[10px] text-slate-400">To Do status</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs transition-card">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
            <span className="text-xs font-medium">In Progress</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.inProgressTasks}</p>
          <span className="text-[10px] text-slate-400">Active work</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs transition-card">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
            <span className="text-xs font-medium">Overdue</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdueTasks}</p>
          <span className="text-[10px] text-slate-400">Past due date</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs transition-card">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
            <span className="text-xs font-medium">Rate %</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.completionRatePercentage}%</p>
          <span className="text-[10px] text-slate-400">Daily productivity</span>
        </div>
      </div>

      {overdueTasksList.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-red-800 dark:text-red-300 font-medium">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            <span>
              You have <span className="font-bold">{overdueTasksList.length} overdue task(s)</span>. Carry them forward to keep your schedule clean.
            </span>
          </div>

          <button
            onClick={carryForwardUnfinishedTasks}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Carry Forward to Today
          </button>
        </div>
      )}

      {/* Inline Quick Add */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <form onSubmit={handleQuickAdd} className="flex items-center gap-3">
          <Plus className="w-5 h-5 text-purple-600 shrink-0" />
          <input
            type="text"
            placeholder="Quick add personal task for today... (Press Enter to save)"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none font-medium"
          />
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Today's Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Personal Tasks</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold">
              {todaysTasks.length}
            </span>
          </div>

          <button
            onClick={() => setActiveView('todays-tasks')}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
          >
            View All Today →
          </button>
        </div>

        {todaysTasks.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
            <CalendarDays className="w-10 h-10 mx-auto opacity-40 stroke-1" />
            <p className="text-sm font-medium">No personal tasks scheduled for today</p>
            <button
              onClick={() => openTaskModal()}
              className="px-4 py-2 bg-purple-600 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              + Create Today's First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaysTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
