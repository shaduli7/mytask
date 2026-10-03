'use client';

import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskCard } from '@/components/tasks/TaskCard';

export const UpcomingTasksView = () => {
  const { tasks, openTaskModal } = useTaskContext();

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingTasks = tasks
    .filter((t) => t.dueDate > todayStr && t.status !== 'Done')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Upcoming Work & Deliverables
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              {upcomingTasks.length} upcoming
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stay ahead of schedule by reviewing future deadlines.
          </p>
        </div>

        <button
          onClick={() => openTaskModal()}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Task</span>
        </button>
      </div>

      {upcomingTasks.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
          <Clock className="w-12 h-12 mx-auto opacity-40 stroke-1" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            No upcoming tasks scheduled
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            You don't have any pending tasks set for future dates. Plan ahead by adding new upcoming tasks.
          </p>
          <button
            onClick={() => openTaskModal()}
            className="px-4 py-2 bg-purple-600 text-white font-semibold text-xs rounded-xl cursor-pointer"
          >
            Add Future Task
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {upcomingTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
