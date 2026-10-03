'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { showNativeNotification, playNotificationSound } from '@/services/notificationService';

export const SimpleTaskView = () => {
  const { tasks, addTask, toggleTaskComplete, deleteTask } = useTaskContext();

  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');
  const [taskTitle, setTaskTitle] = useState('');
  const [dueTime, setDueTime] = useState('18:00');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  const todayStr = new Date().toISOString().split('T')[0];

  const activeTasks = tasks.filter((t) => {
    if (tab === 'daily') {
      return t.dueDate === todayStr || t.recurring === 'Daily';
    } else {
      return t.dueDate >= todayStr || t.recurring === 'Weekly';
    }
  });

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      category: tab === 'daily' ? 'Daily' : 'Weekly',
      priority: 'Medium',
      status: 'To Do',
      dueDate: todayStr,
      dueTime: dueTime,
      reminderDateTime: `${todayStr}T${dueTime}`,
      recurring: frequency === 'daily' ? 'Daily' : 'Weekly',
    });

    setTaskTitle('');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHoursMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentDateStr = now.toISOString().split('T')[0];

      tasks.forEach((t) => {
        if (t.status !== 'Done' && t.dueDate <= currentDateStr && t.dueTime) {
          if (currentHoursMin >= t.dueTime && !t.reminderSent) {
            playNotificationSound();
            showNativeNotification(
              '⚠️ Personal Task Alarm!',
              `Task "${t.title}" is overdue!`
            );
          }
        }
      });
    }, 20000);

    return () => clearInterval(interval);
  }, [tasks]);

  const pendingCount = activeTasks.filter((t) => t.status !== 'Done').length;
  const completedCount = activeTasks.filter((t) => t.status === 'Done').length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-3 py-1 bg-white/20 rounded-full text-purple-100 inline-block mb-2">
            Personal Task Manager
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">My Personal Tasks</h1>
          <p className="text-xs text-purple-100 mt-1">
            Add your daily and weekly tasks. Mark done when completed.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
          <button
            onClick={() => {
              setTab('daily');
              setFrequency('daily');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'daily' ? 'bg-white text-purple-700 shadow-md' : 'text-purple-100 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Daily</span>
          </button>

          <button
            onClick={() => {
              setTab('weekly');
              setFrequency('weekly');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'weekly' ? 'bg-white text-purple-700 shadow-md' : 'text-purple-100 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Weekly</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md">
        <form onSubmit={handleQuickSubmit} className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={
                tab === 'daily'
                  ? 'Add a new daily personal task...'
                  : 'Add a new weekly task...'
              }
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              autoFocus
            />

            <button
              type="submit"
              disabled={!taskTitle.trim()}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs rounded-2xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <label className="flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>Alarm Time:</span>
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Repeat:</span>
              <button
                type="button"
                onClick={() => setFrequency(frequency === 'daily' ? 'weekly' : 'daily')}
                className="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-xl font-semibold border border-purple-200 dark:border-purple-800"
              >
                {frequency === 'daily' ? '🔄 Daily' : '📅 Weekly'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold px-2">
        <div className="flex items-center gap-4">
          <span className="text-slate-600 dark:text-slate-300">
            Pending: <span className="text-purple-600 font-bold">{pendingCount}</span>
          </span>
          <span className="text-slate-600 dark:text-slate-300">
            Completed: <span className="text-emerald-600 font-bold">{completedCount}</span>
          </span>
        </div>

        <span className="text-slate-400 text-[11px]">
          {tab === 'daily' ? 'Daily' : 'Weekly'} View
        </span>
      </div>

      <div className="space-y-3">
        {activeTasks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400 space-y-2">
            <Sparkles className="w-10 h-10 mx-auto opacity-40 text-purple-500" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No {tab} tasks added yet
            </p>
          </div>
        ) : (
          activeTasks.map((t) => {
            const isDone = t.status === 'Done';
            const isOverdue = !isDone && t.dueDate <= todayStr && t.dueTime && new Date().toTimeString().slice(0, 5) > t.dueTime;

            return (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
                    : isOverdue
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900 shadow-md ring-2 ring-red-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskComplete(t.id)}
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-purple-500 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-purple-500" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h3
                      onClick={() => toggleTaskComplete(t.id)}
                      className={`text-sm font-bold cursor-pointer transition-colors ${
                        isDone
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white hover:text-purple-600'
                      }`}
                    >
                      {t.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] mt-1 text-slate-500">
                      {t.dueTime && (
                        <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                          <Clock className="w-3 h-3" />
                          <span>Alarm at {t.dueTime}</span>
                        </span>
                      )}

                      {isOverdue && (
                        <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>ALARM DUE!</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : isOverdue
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 animate-pulse'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    }`}
                  >
                    {isDone ? 'DONE' : isOverdue ? 'OVERDUE' : 'PENDING'}
                  </span>

                  <button
                    onClick={() => deleteTask(t.id)}
                    title="Delete"
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
