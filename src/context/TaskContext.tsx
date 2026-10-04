'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  UserSettings,
  NotificationItem,
  TaskFilterOptions,
  DashboardStats,
  Priority,
  Status
} from '@/types/task';
import {
  getStoredTasks,
  saveStoredTasks,
  getStoredSettings,
  saveStoredSettings,
  getStoredNotifications,
  saveStoredNotifications
} from '@/services/storageService';
import {
  showNativeNotification,
  playNotificationSound,
  registerServiceWorker
} from '@/services/notificationService';

export type ViewType =
  | 'workspace'
  | 'meeting-notes'
  | 'todays-tasks'
  | 'weekly-tasks'
  | 'monthly-tasks'
  | 'completed-tasks'
  | 'settings'
  | 'simple'
  | 'dashboard'
  | 'my-tasks'
  | 'upcoming-tasks'
  | 'calendar'
  | 'analytics';

interface TaskContextType {
  tasks: Task[];
  notifications: NotificationItem[];
  settings: UserSettings;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  filters: TaskFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterOptions>>;
  
  // Modals & Focus Mode
  isTaskModalOpen: boolean;
  openTaskModal: (taskToEdit?: Task | null) => void;
  closeTaskModal: () => void;
  editingTask: Task | null;
  
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  
  isFocusModeOpen: boolean;
  openFocusMode: (task: Task) => void;
  closeFocusMode: () => void;
  focusTask: Task | null;

  // Task Operations
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'reminderSent'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  carryForwardUnfinishedTasks: () => void;
  
  // Notification Operations
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  snoozeNotification: (taskId: string, minutes: number) => void;
  clearAllNotifications: () => void;

  // Settings & Tools
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;

  // Metrics
  stats: DashboardStats;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const DEFAULT_FILTERS: TaskFilterOptions = {
  searchQuery: '',
  priority: 'All',
  status: 'All',
  category: 'All',
  dateRange: 'all',
  sortBy: 'deadline',
  sortOrder: 'asc',
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings());
  const [activeView, setActiveView] = useState<ViewType>('workspace');
  const [filters, setFilters] = useState<TaskFilterOptions>(DEFAULT_FILTERS);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);

  // Client init
  useEffect(() => {
    setTasks(getStoredTasks());
    setNotifications(getStoredNotifications());
    setSettings(getStoredSettings());
    registerServiceWorker();
  }, []);

  // Theme toggle effect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Sync state to local storage
  useEffect(() => {
    if (tasks.length > 0) saveStoredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStoredNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Fast background reminder scheduler (checks every 3 seconds)
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      const currentDate = String(now.getDate()).padStart(2, '0');
      const todayStr = `${currentYear}-${currentMonth}-${currentDate}`;

      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${mins}`;

      setTasks((prevTasks) => {
        let updated = false;
        const newTasks = prevTasks.map((t) => {
          if (t.status === 'Done') return t;

          // Check snoozed reminders
          if (t.snoozedUntil) {
            const snoozedTime = new Date(t.snoozedUntil);
            if (now >= snoozedTime) {
              playNotificationSound();
              showNativeNotification('⏰ Snoozed Personal Task Alarm!', `Time to complete: "${t.title}"`);

              setNotifications((prevNotifs) => [
                {
                  id: `notif-${Date.now()}-${Math.random()}`,
                  taskId: t.id,
                  title: '⏰ Snoozed Personal Task Alarm!',
                  message: `Time to finish: "${t.title}"`,
                  timestamp: now.toISOString(),
                  type: 'reminder',
                  read: false,
                },
                ...prevNotifs,
              ]);

              updated = true;
              return { ...t, snoozedUntil: null, reminderSent: true };
            }
          }

          // Check Task Due Alarm (using local date & time comparison)
          const isDueOrPast =
            t.status !== 'Done' &&
            (t.dueDate < todayStr ||
              (t.dueDate === todayStr && t.dueTime && t.dueTime <= currentTimeStr));

          if (isDueOrPast && !t.reminderSent) {
            playNotificationSound();
            showNativeNotification('🚨 Task Alarm Triggered!', `Task "${t.title}" is due now!`);

            setNotifications((prevNotifs) => [
              {
                id: `notif-${Date.now()}-${Math.random()}`,
                taskId: t.id,
                title: '🚨 Task Alarm Triggered!',
                message: `Task "${t.title}" is due now (${t.dueTime || t.dueDate}).`,
                timestamp: now.toISOString(),
                type: 'reminder',
                read: false,
              },
              ...prevNotifs,
            ]);

            updated = true;
            return { ...t, reminderSent: true };
          }

          return t;
        });

        if (updated) saveStoredTasks(newTasks);
        return updated ? newTasks : prevTasks;
      });
    };

    // Run check immediately on mount and every 3 seconds
    checkReminders();
    const intervalId = setInterval(checkReminders, 3000);
    return () => clearInterval(intervalId);
  }, []);

  // Compute metrics
  const todayStr = typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : '2026-10-03';
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const pendingTasks = tasks.filter((t) => t.status === 'To Do').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const overdueTasks = tasks.filter((t) => t.status !== 'Done' && t.dueDate < todayStr).length;
  const completionRatePercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats: DashboardStats = {
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    overdueTasks,
    completionRatePercentage,
  };

  // Modals
  const openTaskModal = (taskToEdit: Task | null = null) => {
    setEditingTask(taskToEdit);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const openFocusMode = (task: Task) => {
    setFocusTask(task);
    setIsFocusModeOpen(true);
  };

  const closeFocusMode = () => {
    setIsFocusModeOpen(false);
    setFocusTask(null);
  };

  // Task CRUD
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'reminderSent'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      completedAt: taskData.status === 'Done' ? new Date().toISOString() : null,
      reminderSent: false,
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isMarkingDone = updatedFields.status === 'Done' && t.status !== 'Done';
          return {
            ...t,
            ...updatedFields,
            completedAt: isMarkingDone ? new Date().toISOString() : (updatedFields.status && updatedFields.status !== 'Done' ? null : t.completedAt),
            reminderSent: isMarkingDone ? true : t.reminderSent,
            snoozedUntil: isMarkingDone ? null : t.snoozedUntil,
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setNotifications((prev) => prev.filter((n) => n.taskId !== id));
  };

  const duplicateTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const duplicated: Task = {
      ...target,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `${target.title} (Copy)`,
      status: 'To Do',
      createdAt: new Date().toISOString(),
      completedAt: null,
      reminderSent: false,
      snoozedUntil: null,
    };

    setTasks((prev) => [duplicated, ...prev]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus: Status = t.status === 'Done' ? 'To Do' : 'Done';
          const isDone = newStatus === 'Done';

          if (isDone) {
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
            } catch {}

            if (t.recurring !== 'None') {
              createNextRecurringTask(t);
            }
          }

          return {
            ...t,
            status: newStatus,
            completedAt: isDone ? new Date().toISOString() : null,
            reminderSent: isDone ? true : t.reminderSent,
            snoozedUntil: isDone ? null : t.snoozedUntil,
          };
        }
        return t;
      })
    );
  };

  const createNextRecurringTask = (task: Task) => {
    const currentDueDate = new Date(task.dueDate);
    const nextDueDate = new Date(currentDueDate);

    if (task.recurring === 'Daily') {
      nextDueDate.setDate(nextDueDate.getDate() + 1);
    } else if (task.recurring === 'Weekly') {
      nextDueDate.setDate(nextDueDate.getDate() + 7);
    } else if (task.recurring === 'Monthly') {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    }

    const nextTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      status: 'To Do',
      dueDate: nextDueDate.toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      completedAt: null,
      reminderSent: false,
      snoozedUntil: null,
    };

    setTimeout(() => {
      setTasks((prev) => [nextTask, ...prev]);
    }, 300);
  };

  const carryForwardUnfinishedTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    let count = 0;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.status !== 'Done' && t.dueDate < today) {
          count++;
          return {
            ...t,
            dueDate: today,
            reminderSent: false,
          };
        }
        return t;
      })
    );

    if (count > 0) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Personal Tasks Moved',
          message: `Moved ${count} unfinished task(s) to today's schedule.`,
          timestamp: new Date().toISOString(),
          type: 'info',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  // Notification methods
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const snoozeNotification = (taskId: string, minutes: number) => {
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + minutes);

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            snoozedUntil: snoozeTime.toISOString(),
            reminderSent: false,
          };
        }
        return t;
      })
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const exportData = (): string => {
    const bundle = {
      tasks,
      settings,
      notifications,
      exportDate: new Date().toISOString(),
      app: 'MyTaskFlow Personal',
    };
    return JSON.stringify(bundle, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.tasks && Array.isArray(parsed.tasks)) {
        setTasks(parsed.tasks);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.notifications) setNotifications(parsed.notifications);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        notifications,
        settings,
        activeView,
        setActiveView,
        filters,
        setFilters,
        isTaskModalOpen,
        openTaskModal,
        closeTaskModal,
        editingTask,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isFocusModeOpen,
        openFocusMode,
        closeFocusMode,
        focusTask,
        addTask,
        updateTask,
        deleteTask,
        duplicateTask,
        toggleTaskComplete,
        carryForwardUnfinishedTasks,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        snoozeNotification,
        clearAllNotifications,
        updateSettings,
        exportData,
        importData,
        stats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
