'use client';

import React from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskCard } from '@/components/tasks/TaskCard';

export const WeeklyTasksView = () => {
  const { tasks, openTaskModal } = useTaskContext();

  const todayStr = new Date().toISOString().split('T')[0];
  
  // Weekly tasks: due within 7 days or recurring weekly
  const weeklyTasks = tasks.filter((t) => {
    return t.dueDate >= todayStr || t.recurring === 'Weekly';
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Weekly Tasks
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-semibold">
              {weeklyTasks.length} tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tasks assigned for this week.
          </p>
        </div>

        <button
          onClick={() => openTaskModal()}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Weekly Task</span>
        </button>
      </div>

      {weeklyTasks.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
          <CalendarDays className="w-12 h-12 mx-auto opacity-40 stroke-1" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            No weekly tasks scheduled
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            Add tasks assigned for this week or recurring weekly goals.
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
          {weeklyTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
