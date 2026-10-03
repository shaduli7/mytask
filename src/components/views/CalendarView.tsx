'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskCard } from '@/components/tasks/TaskCard';

export const CalendarView = () => {
  const { tasks, openTaskModal } = useTaskContext();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1));
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  const formatDateStr = (dayNum: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const selectedDateTasks = tasks.filter((t) => t.dueDate === selectedDateStr);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span>Task Calendar</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click any date cell to schedule personal tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Week View
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
          >
            Today
          </button>

          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
            <button onClick={prevMonth} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-900 dark:text-white min-w-[120px] text-center">
              {monthName}
            </span>
            <button onClick={nextMonth} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-xs overflow-hidden">
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 dark:text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-700/50">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-1 mt-2">
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="min-h-[90px] sm:min-h-[110px] p-2 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-transparent opacity-40" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = formatDateStr(dayNum);
            const isTodayCell = dateStr === todayStr;
            const isSelectedCell = dateStr === selectedDateStr;
            const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`min-h-[90px] sm:min-h-[110px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelectedCell
                    ? 'border-purple-600 bg-purple-50/30 dark:bg-purple-950/20 ring-2 ring-purple-500/20'
                    : isTodayCell
                    ? 'border-purple-300 dark:border-purple-800 bg-purple-50/10 dark:bg-purple-950/10'
                    : 'border-slate-100 dark:border-slate-700/50 bg-slate-50/40 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isTodayCell ? 'bg-purple-600 text-white' : isSelectedCell ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {dayNum}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDateStr(dateStr);
                      openTaskModal({
                        id: '',
                        title: '',
                        category: 'Personal',
                        priority: 'Medium',
                        status: 'To Do',
                        dueDate: dateStr,
                        dueTime: '18:00',
                        recurring: 'None',
                        createdAt: new Date().toISOString(),
                      });
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-purple-600 hover:bg-purple-100 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 overflow-hidden my-1">
                  {dayTasks.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium truncate flex items-center gap-1 ${
                        t.status === 'Done' ? 'line-through bg-slate-100 text-slate-400' : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current" />
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Personal Tasks for {selectedDateStr}
            </h3>
          </div>

          <button
            onClick={() =>
              openTaskModal({
                id: '',
                title: '',
                category: 'Personal',
                priority: 'Medium',
                status: 'To Do',
                dueDate: selectedDateStr,
                dueTime: '18:00',
                recurring: 'None',
                createdAt: new Date().toISOString(),
              })
            }
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task for {selectedDateStr}</span>
          </button>
        </div>

        {selectedDateTasks.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">
            No personal tasks scheduled for this date.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedDateTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
