'use client';

import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskCard } from '@/components/tasks/TaskCard';

export const MonthlyTasksView = () => {
  const { tasks, openTaskModal } = useTaskContext();

  const today = new Date();
  const currentYearMonth = today.toISOString().slice(0, 7); // YYYY-MM

  const monthlyTasks = tasks.filter(
    (t) => t.dueDate.startsWith(currentYearMonth) || t.recurring === 'Monthly'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Monthly Tasks
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              {monthlyTasks.length} tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tasks scheduled for {today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}.
          </p>
        </div>

        <button
          onClick={() => openTaskModal()}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Monthly Task</span>
        </button>
      </div>

      {monthlyTasks.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
          <Calendar className="w-12 h-12 mx-auto opacity-40 stroke-1" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            No monthly tasks scheduled
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            Add tasks assigned for this month or recurring monthly tasks.
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
          {monthlyTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
