'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Clock, Sparkles, AlertCircle, Calendar } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';

export const NotificationCenter = () => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    snoozeNotification
  } = useTaskContext();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTimeAgo = (timestampStr: string) => {
    try {
      const date = new Date(timestampStr);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        className="relative p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-200 dark:hover:border-purple-800 transition-all cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[500px] animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</h3>
              {unreadNotificationCount > 0 && (
                <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadNotificationCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadNotificationCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  title="Mark all as read"
                  className="p-1.5 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Read all</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  title="Clear all"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
                <Bell className="w-8 h-8 opacity-40 stroke-1" />
                <p className="text-xs font-medium">No notifications yet</p>
                <p className="text-[11px] text-slate-400">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 transition-colors flex gap-3 ${
                    !notif.read ? 'bg-purple-50/40 dark:bg-purple-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'overdue' && (
                      <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                    {notif.type === 'reminder' && (
                      <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                    )}
                    {notif.type === 'morning_summary' && (
                      <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    {notif.type === 'info' && (
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Snooze actions for task reminders */}
                    {notif.taskId && notif.type === 'reminder' && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="text-[10px] font-medium text-slate-400">Snooze:</span>
                        {[5, 10, 30].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => {
                              snoozeNotification(notif.taskId!, mins);
                              markNotificationRead(notif.id);
                            }}
                            className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-[10px] font-medium text-slate-600 dark:text-slate-300 rounded-md transition-colors cursor-pointer"
                          >
                            +{mins}m
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {!notif.read && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      title="Mark as read"
                      className="shrink-0 p-1 text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-600" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
