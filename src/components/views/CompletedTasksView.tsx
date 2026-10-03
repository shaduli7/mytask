'use client';

import React, { useState } from 'react';
import { CheckCircle2, Trash2, Search } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskCard } from '@/components/tasks/TaskCard';

export const CompletedTasksView = () => {
  const { tasks, deleteTask } = useTaskContext();
  const [search, setSearch] = useState('');

  const completedTasks = tasks.filter((t) => t.status === 'Done');

  const filtered = completedTasks.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  const clearAllCompleted = () => {
    if (confirm('Are you sure you want to delete all completed personal tasks from history?')) {
      completedTasks.forEach((t) => deleteTask(t.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Completed Tasks History
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              {completedTasks.length} finished
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Archived record of all your accomplished personal tasks.
          </p>
        </div>

        {completedTasks.length > 0 && (
          <button
            onClick={clearAllCompleted}
            className="px-4 py-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search completed tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
          <CheckCircle2 className="w-12 h-12 mx-auto opacity-40 stroke-1 text-emerald-500" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            No completed tasks in history
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
