'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { Priority, Status, RecurringOption, Category } from '@/types/task';

export const TaskModal = () => {
  const {
    isTaskModalOpen,
    closeTaskModal,
    editingTask,
    addTask,
    updateTask,
    settings
  } = useTaskContext();

  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(todayStr);
  const [dueTime, setDueTime] = useState('18:00');
  
  // Optional extra fields (collapsed by default)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>('To Do');

  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDueDate(editingTask.dueDate || todayStr);
      setDueTime(editingTask.dueTime || '18:00');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'Medium');
      setStatus(editingTask.status || 'To Do');
    } else {
      setTitle('');
      setDueDate(todayStr);
      setDueTime('18:00');
      setDescription('');
      setPriority(settings.defaultPriority || 'Medium');
      setStatus('To Do');
    }
    setError('');
    setShowAdvanced(false);
  }, [editingTask, isTaskModalOpen, settings, todayStr]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        dueDate: dueDate || todayStr,
        dueTime: dueTime,
        reminderDateTime: `${dueDate}T${dueTime}`,
        description: description.trim(),
        priority,
        status,
      });
    } else {
      addTask({
        title: title.trim(),
        category: 'Personal',
        priority,
        status,
        dueDate: dueDate || todayStr,
        dueTime: dueTime,
        reminderDateTime: `${dueDate}T${dueTime}`,
        recurring: 'None',
        description: description.trim(),
      });
    }

    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Simple Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter task title and assign the due date.
            </p>
          </div>
          <button
            onClick={closeTaskModal}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Task Title */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 text-xs">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              autoFocus
            />
          </div>

          {/* 2. Priority Selector (Always Visible) */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Priority *</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('High')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'High'
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                <span>High</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('Medium')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'Medium'
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                <span>Medium</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('Low')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'Low'
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                <span>Low</span>
              </button>
            </div>
          </div>

          {/* 3. Assign Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-200 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-black dark:text-white" />
                <span>Assign Date</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-200 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-black dark:text-white" />
                <span>Alarm Time</span>
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          {/* Optional Collapsible Notes & Status */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-black dark:text-white font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{showAdvanced ? 'Hide Optional Note' : '+ Add Note or Description'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in duration-150">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Notes / Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Optional notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold shadow-sm transition-all cursor-pointer"
            >
              {editingTask ? 'Save Changes' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
