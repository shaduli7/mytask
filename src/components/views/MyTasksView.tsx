'use client';

import React from 'react';
import { Plus, CheckSquare } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskFilterBar } from '@/components/tasks/TaskFilterBar';
import { Task } from '@/types/task';

export const MyTasksView = () => {
  const { tasks, filters, openTaskModal } = useTaskContext();

  const filteredTasks = tasks.filter((t) => {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCategory = t.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCategory) return false;
    }

    if (filters.priority && filters.priority !== 'All' && t.priority !== filters.priority) {
      return false;
    }

    if (filters.status && filters.status !== 'All' && t.status !== filters.status) {
      return false;
    }

    if (filters.category && filters.category !== 'All' && t.category !== filters.category) {
      return false;
    }

    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    if (filters.sortBy === 'priority') {
      const pWeight = { High: 3, Medium: 2, Low: 1 };
      comparison = pWeight[b.priority] - pWeight[a.priority];
    } else if (filters.sortBy === 'deadline') {
      comparison = a.dueDate.localeCompare(b.dueDate);
    } else if (filters.sortBy === 'createdAt') {
      comparison = a.createdAt.localeCompare(b.createdAt);
    } else if (filters.sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Personal Tasks Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize and track all your personal daily tasks.
          </p>
        </div>

        <button
          onClick={() => openTaskModal()}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      <TaskFilterBar />

      {sortedTasks.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
          <CheckSquare className="w-12 h-12 mx-auto opacity-40 stroke-1" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            No matching tasks found
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            Try adjusting your search query or filters.
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
          {sortedTasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
