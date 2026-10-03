'use client';

import React, { useState, useEffect } from 'react';
import { Command, Plus, X } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { Priority } from '@/types/task';

export const QuickAddModal = () => {
  const { isQuickAddOpen, setIsQuickAddOpen, addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickAddOpen(true);
      }
      if (e.key === 'Escape' && isQuickAddOpen) {
        setIsQuickAddOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickAddOpen, setIsQuickAddOpen]);

  if (!isQuickAddOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      category: 'Personal',
      priority,
      status: 'To Do',
      dueDate: todayStr,
      dueTime: '18:00',
      reminderDateTime: `${todayStr}T18:00`,
      recurring: 'None',
    });

    setTitle('');
    setIsQuickAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Command className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Quick Personal Task (Press Esc to close)</span>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <input
            type="text"
            placeholder="Type task title and press Enter... (e.g., Doctor appointment)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            autoFocus
          />

          <div className="flex items-center justify-between gap-3 text-xs">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟠 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
            </select>

            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
