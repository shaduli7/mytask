'use client';

import React from 'react';
import {
  Check,
  Calendar,
  Clock,
  Repeat,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Target,
  AlertCircle
} from 'lucide-react';
import { Task } from '@/types/task';
import { useTaskContext } from '@/context/TaskContext';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const {
    toggleTaskComplete,
    deleteTask,
    duplicateTask,
    openTaskModal,
    openFocusMode
  } = useTaskContext();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const isDone = task.status === 'Done';
  const isOverdue = !isDone && task.dueDate < todayStr;
  const isToday = task.dueDate === todayStr;

  const formatCompletedTime = (isoString?: string | null) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      className={`group relative px-4 py-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4 ${
        menuOpen ? 'z-40' : 'z-0'
      } ${
        isDone
          ? 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-60'
          : isOverdue
          ? 'bg-zinc-100/80 dark:bg-zinc-900 border-zinc-400 dark:border-zinc-700 shadow-xs'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:border-black dark:hover:border-white'
      }`}
    >
      {/* Left section: Checkbox + Task Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={() => toggleTaskComplete(task.id)}
          title={isDone ? 'Mark as pending' : 'Mark as completed'}
          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            isDone
              ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black'
              : 'border-zinc-300 dark:border-zinc-600 hover:border-black dark:hover:border-white bg-white dark:bg-zinc-900'
          }`}
        >
          {isDone && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            onClick={() => openTaskModal(task)}
            className={`text-sm font-bold cursor-pointer transition-colors truncate ${
              isDone
                ? 'line-through text-zinc-400 dark:text-zinc-500'
                : 'text-zinc-900 dark:text-white hover:text-black dark:hover:text-white'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-sm hidden sm:block">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Middle & Right section: Priority Badge + Task Date/Time + Menu */}
      <div className="flex items-center gap-4 sm:gap-8 shrink-0">
        {/* Priority Badge */}
        <span
          className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold leading-none shadow-2xs ${
            task.priority === 'High'
              ? 'bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white'
              : task.priority === 'Medium'
              ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700'
              : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              task.priority === 'High'
                ? 'bg-white dark:bg-black'
                : task.priority === 'Medium'
                ? 'bg-zinc-600 dark:bg-zinc-300'
                : 'bg-zinc-400 dark:bg-zinc-600'
            }`}
          />
          <span className="hidden sm:inline leading-none">{task.priority} Priority</span>
          <span className="sm:hidden leading-none">{task.priority}</span>
        </span>

        {/* Task Date & Time */}
        <div
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold leading-none ${
            isOverdue
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border border-black dark:border-white'
              : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700'
          }`}
        >
          {isOverdue ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-white dark:text-black" />
          ) : (
            <Calendar className="w-3.5 h-3.5 shrink-0 text-zinc-900 dark:text-zinc-100" />
          )}
          <span className="leading-none">
            {isToday ? 'Today' : task.dueDate}
            {task.dueTime ? ` at ${task.dueTime}` : ''}
          </span>
        </div>

        {/* Action Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 py-2 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-900/10">
              <button
                onClick={() => {
                  openTaskModal(task);
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer text-slate-800 dark:text-slate-100 font-bold"
              >
                <Edit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Edit Task</span>
              </button>

              {!isDone && (
                <button
                  onClick={() => {
                    openFocusMode(task);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-950/50 flex items-center gap-2.5 cursor-pointer text-purple-700 dark:text-purple-300 font-bold"
                >
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>Focus Mode</span>
                </button>
              )}

              <button
                onClick={() => {
                  duplicateTask(task.id);
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer text-slate-800 dark:text-slate-100 font-bold"
              >
                <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Duplicate</span>
              </button>

              <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

              <button
                onClick={() => {
                  deleteTask(task.id);
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2.5 cursor-pointer font-bold"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Delete Task</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
