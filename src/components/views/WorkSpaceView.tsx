'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Calendar,
  FileText,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Edit2,
  Check,
  Search,
  Zap,
  Flag,
  BellRing,
  VolumeX
} from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { Priority } from '@/types/task';
import {
  startContinuousAlarm,
  stopContinuousAlarm,
  showNativeNotification,
  requestNotificationPermission
} from '@/services/notificationService';

export const WorkSpaceView = () => {
  const { tasks, addTask, toggleTaskComplete, deleteTask, updateTask, snoozeNotification } = useTaskContext();

  const [tab, setTab] = useState<'today' | 'week' | 'notes' | 'done'>('today');
  const [taskTitle, setTaskTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [dueTime, setDueTime] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 15);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [assignDate, setAssignDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<Priority>('Medium');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [search, setSearch] = useState('');
  const [activeAlarmTask, setActiveAlarmTask] = useState<any | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Monitor alarms and loop sound until stopped
  useEffect(() => {
    const checkLiveAlarms = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      const currentDate = String(now.getDate()).padStart(2, '0');
      const todayDateStr = `${currentYear}-${currentMonth}-${currentDate}`;

      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${mins}`;

      const ringing = tasks.find((t) => {
        // 1. Task must NOT be completed!
        if (t.status === 'Done') return false;

        // 2. Alarm must NOT have been turned off already!
        if (t.reminderSent) return false;

        // 3. Ring ONLY when assigned time/date has arrived!
        if (t.dueDate === todayDateStr && t.dueTime) {
          return currentTimeStr >= t.dueTime;
        }

        // Overdue task from past date (only if user hasn't turned off alarm)
        if (t.dueDate < todayDateStr && t.dueTime) {
          return true;
        }

        return false;
      });

      if (ringing) {
        if (!activeAlarmTask || activeAlarmTask.id !== ringing.id) {
          setActiveAlarmTask(ringing);
          startContinuousAlarm();
          showNativeNotification('🚨 Task Alarm Ringing!', `Task "${ringing.title}" is due now!`);
        }
      } else if (activeAlarmTask) {
        setActiveAlarmTask(null);
        stopContinuousAlarm();
      }
    };

    checkLiveAlarms();
    const interval = setInterval(checkLiveAlarms, 1500);
    return () => clearInterval(interval);
  }, [tasks, activeAlarmTask]);

  const handleStopAlarm = () => {
    stopContinuousAlarm();
    if (activeAlarmTask) {
      updateTask(activeAlarmTask.id, { reminderSent: true });
    }
    setActiveAlarmTask(null);
  };

  const handleSnoozeAlarm = () => {
    stopContinuousAlarm();
    if (activeAlarmTask) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      const newDueTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      updateTask(activeAlarmTask.id, { dueTime: newDueTime, reminderSent: false });
    }
    setActiveAlarmTask(null);
  };

  const handleDoneAlarm = () => {
    stopContinuousAlarm();
    if (activeAlarmTask) {
      toggleTaskComplete(activeAlarmTask.id);
      updateTask(activeAlarmTask.id, { reminderSent: true });
    }
    setActiveAlarmTask(null);
  };

  const filteredTasks = tasks.filter((t) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    if (tab === 'today') {
      return t.status !== 'Done' && t.dueDate === todayStr;
    }
    if (tab === 'week') {
      return t.status !== 'Done' && t.dueDate >= todayStr;
    }
    if (tab === 'notes') {
      return t.status !== 'Done' && (Boolean(t.description) || t.category === 'Note');
    }
    if (tab === 'done') {
      return t.status === 'Done';
    }
    return true;
  });

  const handleAddWorkItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const now = new Date();
    const currentHoursMins = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const targetDate = assignDate || todayStr;
    const isPastTime = targetDate < todayStr || (targetDate === todayStr && dueTime < currentHoursMins);

    addTask({
      title: taskTitle.trim(),
      description: noteContent.trim() || undefined,
      category: tab === 'notes' ? 'Note' : 'Work Task',
      priority: priority,
      status: 'To Do',
      dueDate: targetDate,
      dueTime: dueTime,
      reminderDateTime: `${targetDate}T${dueTime}`,
      recurring: 'None',
      reminderSent: isPastTime,
    });

    setTaskTitle('');
    setNoteContent('');
  };

  const handleInlineSave = (id: string) => {
    if (!editText.trim()) return;
    updateTask(id, { title: editText.trim() });
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* 🚨 CONTINUOUS LOOPING ALARM BANNER (Stops ONLY when user clicks Stop / Snooze / Done) */}
      {activeAlarmTask && (
        <div className="bg-red-600 text-white rounded-3xl p-5 shadow-2xl animate-bounce border-2 border-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <BellRing className="w-7 h-7 text-yellow-300 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-yellow-300">
                🔔 ALARM RINGING CONTINUOUSLY!
              </span>
              <h2 className="text-lg font-extrabold">{activeAlarmTask.title}</h2>
              <p className="text-xs text-red-100">
                Alarm time reached: {activeAlarmTask.dueTime || activeAlarmTask.dueDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStopAlarm}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <VolumeX className="w-4 h-4 text-yellow-300" />
              <span>Turn Off Alarm</span>
            </button>

            <button
              onClick={handleSnoozeAlarm}
              className="px-3.5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Snooze 5m
            </button>

            <button
              onClick={handleDoneAlarm}
              className="px-5 py-2.5 bg-white text-red-700 hover:bg-red-50 font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Mark Done ✓
            </button>
          </div>
        </div>
      )}

      {/* Simple Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-black dark:text-white tracking-tight">Work Tasks</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Simple, distraction-free space for daily work tasks.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0">
          <button
            onClick={() => setTab('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'today'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Today
          </button>

          <button
            onClick={() => setTab('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'week'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            This Week
          </button>

          <button
            onClick={() => setTab('done')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'done'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Done
          </button>
        </div>
      </div>

      {/* Quick Input Box */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
        <form onSubmit={handleAddWorkItem} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              placeholder={
                tab === 'notes'
                  ? 'Add a quick work note or idea...'
                  : 'What work task are you doing today? (e.g. Finish report, Send email update)'
              }
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-semibold text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              autoFocus
            />

            <button
              type="submit"
              disabled={!taskTitle.trim()}
              className="px-6 py-3 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 disabled:opacity-40 text-white dark:text-black font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Work Task</span>
            </button>
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
                <Calendar className="w-3.5 h-3.5 text-black dark:text-white" />
                <span>Date:</span>
                <input
                  type="date"
                  value={assignDate}
                  onChange={(e) => setAssignDate(e.target.value)}
                  className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-black dark:text-white" />
                <span>Time:</span>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
                <Flag className="w-3.5 h-3.5 text-black dark:text-white" />
                <span>Priority:</span>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-900 dark:text-white focus:outline-none"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              placeholder="Optional quick note/link..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="flex-1 min-w-[180px] px-3 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400"
            />
          </div>
        </form>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search work tasks & notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <span className="text-xs text-slate-400 font-semibold">
          {filteredTasks.length} {tab} items
        </span>
      </div>

      {/* Work Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400 space-y-2">
            <Sparkles className="w-10 h-10 mx-auto opacity-40 text-purple-500" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No work items in {tab} view
            </p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isDone = t.status === 'Done';
            const isEditing = editingId === t.id;

            return (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  isDone
                    ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskComplete(t.id)}
                    className={`mt-0.5 w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-purple-500 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 hover:text-purple-500" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1 space-y-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleInlineSave(t.id)}
                          className="p-1 bg-emerald-600 text-white rounded-md cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <h3
                        onClick={() => toggleTaskComplete(t.id)}
                        className={`text-sm font-bold cursor-pointer transition-colors leading-snug ${
                          isDone
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white hover:text-purple-600'
                        }`}
                      >
                        {t.title}
                      </h3>
                    )}

                    {t.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed font-normal">
                        {t.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1 text-slate-400 font-medium">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-2xs ${
                          t.priority === 'High'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800'
                            : t.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        {t.priority === 'High' ? '🔴 High Priority' : t.priority === 'Medium' ? '🟠 Medium Priority' : '🟢 Low Priority'}
                      </span>

                      <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                        <Calendar className="w-3 h-3" />
                        <span>{t.dueDate === todayStr ? 'Today' : t.dueDate}</span>
                      </span>

                      {t.dueTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{t.dueTime}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!isEditing && (
                    <button
                      onClick={() => {
                        setEditingId(t.id);
                        setEditText(t.title);
                      }}
                      title="Edit Title"
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => deleteTask(t.id)}
                    title="Delete"
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
