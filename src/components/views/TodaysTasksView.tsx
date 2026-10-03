'use client';

import React from 'react';
import { CalendarDays, Plus, Sparkles } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskCard } from '@/components/tasks/TaskCard';

export const TodaysTasksView = () => {
  const { tasks, openTaskModal, carryForwardUnfinishedTasks } = useTaskContext();

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter((t) => t.dueDate === todayStr);
  const pendingCount = todaysTasks.filter((t) => t.status !== 'Done').length;
  const completedCount = todaysTasks.filter((t) => t.status === 'Done').length;

  const overdueCount = tasks.filter((t) => t.dueDate < todayStr && t.status !== 'Done').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Today's Schedule
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold">
              {todaysTasks.length} tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Focus on your top priorities for today ({new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}).
          </p>
        </div>

        <button
          onClick={() => openTaskModal()}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task for Today</span>
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Pending Today</span>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{pendingCount}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Completed Today</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Unfinished Overdue</span>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{overdueCount}</p>
          </div>
          {overdueCount > 0 && (
            <button
              onClick={carryForwardUnfinishedTasks}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium cursor-pointer"
            >
              Carry Forward
            </button>
          )}
        </div>
      </div>

      {/* Today's Tasks Grid */}
      {todaysTasks.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
          <CalendarDays className="w-12 h-12 mx-auto opacity-40 stroke-1" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            No tasks scheduled for today
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            You are all caught up for today! Add a new task or carry forward unfinished tasks from yesterday.
          </p>
          <button
            onClick={() => openTaskModal()}
            className="px-4 py-2 bg-purple-600 text-white font-semibold text-xs rounded-xl cursor-pointer"
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {todaysTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
