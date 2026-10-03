import { Task, UserSettings, NotificationItem, MeetingNote } from '@/types/task';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const TASKS_STORAGE_KEY = 'mytaskflow_personal_tasks_v2';
const SETTINGS_STORAGE_KEY = 'mytaskflow_settings_v2';
const NOTIFICATIONS_STORAGE_KEY = 'mytaskflow_notifications_v2';
const MEETING_NOTES_STORAGE_KEY = 'mytaskflow_meeting_notes_v1';

export const INITIAL_MEETING_NOTES: MeetingNote[] = [
  {
    id: 'note-1',
    title: 'Project Kickoff & Scope Review',
    date: '2026-10-03',
    time: '11:00',
    attendees: 'Alex, Sarah, Manager',
    category: 'Project',
    summaryParagraph: 'Discussed project roadmap, key deliverables, sprint goals, and task assignments. Ensured all team members are aligned on priorities.',
    bulletPoints: [
      { id: 'b1', text: 'Finalize UI/UX design mockups by Friday', completed: true },
      { id: 'b2', text: 'Set up database schema and API endpoints', completed: false },
      { id: 'b3', text: 'Schedule follow-up review meeting next Tuesday', completed: false }
    ],
    createdAt: new Date('2026-10-03T11:00:00').toISOString()
  }
];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  userName: 'Personal Workspace',
  email: 'user@mytaskflow.io',
  defaultPriority: 'Medium',
  defaultReminderOffsetMinutes: 15,
  enableBrowserNotifications: true,
  enableSoundAlerts: true,
  enableMorningReminder: true,
  enableEodSummary: true,
  morningReminderTime: '08:00',
  eodSummaryTime: '18:00',
  theme: 'light',
  timeZone: 'Asia/Kolkata',
};

const getRelativeDateStr = (offsetDays: number): string => {
  const base = new Date('2026-10-03T00:00:00');
  base.setDate(base.getDate() + offsetDays);
  return base.toISOString().split('T')[0];
};

export const INITIAL_DEMO_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Morning Exercise & Jogging',
    description: '30 minutes cardio workout at the local park.',
    category: 'Health',
    priority: 'High',
    status: 'In Progress',
    dueDate: getRelativeDateStr(0), // Today
    dueTime: '07:00',
    reminderDateTime: `${getRelativeDateStr(0)}T06:45`,
    recurring: 'Daily',
    createdAt: new Date('2026-10-01T06:00:00').toISOString(),
    completedAt: null,
    reminderSent: false,
  },
  {
    id: 'task-2',
    title: 'Buy Groceries & Weekly Vegetables',
    description: 'Milk, eggs, fruits, bread, and vegetables.',
    category: 'Shopping',
    priority: 'Medium',
    status: 'To Do',
    dueDate: getRelativeDateStr(0), // Today
    dueTime: '18:30',
    reminderDateTime: `${getRelativeDateStr(0)}T18:00`,
    recurring: 'Weekly',
    createdAt: new Date('2026-10-02T10:15:00').toISOString(),
    completedAt: null,
    reminderSent: false,
  },
  {
    id: 'task-3',
    title: 'Pay Electricity & Water Bills',
    description: 'Online bill payment via UPI before due date.',
    category: 'Finance',
    priority: 'High',
    status: 'To Do',
    dueDate: getRelativeDateStr(-1), // Yesterday - Overdue
    dueTime: '16:00',
    reminderDateTime: `${getRelativeDateStr(-1)}T15:30`,
    recurring: 'Monthly',
    createdAt: new Date('2026-09-28T11:00:00').toISOString(),
    completedAt: null,
    reminderSent: true,
  },
  {
    id: 'task-4',
    title: 'Read 20 Pages of Book',
    description: 'Daily reading routine.',
    category: 'Personal',
    priority: 'Low',
    status: 'Done',
    dueDate: getRelativeDateStr(0), // Today
    dueTime: '21:00',
    reminderDateTime: `${getRelativeDateStr(0)}T20:45`,
    recurring: 'Daily',
    createdAt: new Date('2026-10-01T14:00:00').toISOString(),
    completedAt: new Date('2026-10-03T11:35:00').toISOString(),
    reminderSent: true,
  },
  {
    id: 'task-5',
    title: 'Doctor Health Checkup Appointment',
    description: 'Routine quarterly checkup at Apollo Clinic.',
    category: 'Health',
    priority: 'High',
    status: 'To Do',
    dueDate: getRelativeDateStr(2), // +2 days
    dueTime: '10:00',
    reminderDateTime: `${getRelativeDateStr(2)}T09:30`,
    recurring: 'None',
    createdAt: new Date('2026-10-02T16:00:00').toISOString(),
    completedAt: null,
    reminderSent: false,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    taskId: 'task-3',
    title: 'Overdue Personal Task Alert',
    message: '"Pay Electricity & Water Bills" was due yesterday at 16:00.',
    timestamp: new Date('2026-10-03T08:00:00').toISOString(),
    type: 'overdue',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Good Morning!',
    message: 'You have personal tasks scheduled for today. Have a great day!',
    timestamp: new Date('2026-10-03T08:05:00').toISOString(),
    type: 'morning_summary',
    read: false,
  },
];

// Local Storage Services
export const getStoredTasks = (): Task[] => {
  if (typeof window === 'undefined') return INITIAL_DEMO_TASKS;
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_TASKS));
      return INITIAL_DEMO_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_TASKS;
  }
};

export const saveStoredTasks = (tasks: Task[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Error saving tasks to localStorage:', err);
  }
};

export const getStoredSettings = (): UserSettings => {
  if (typeof window === 'undefined') return DEFAULT_USER_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_USER_SETTINGS));
      return DEFAULT_USER_SETTINGS;
    }
    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
};

export const saveStoredSettings = (settings: UserSettings) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings to localStorage:', err);
  }
};

export const getStoredNotifications = (): NotificationItem[] => {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveStoredNotifications = (notifications: NotificationItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (err) {
    console.error('Error saving notifications to localStorage:', err);
  }
};

export const getStoredMeetingNotes = (): MeetingNote[] => {
  if (typeof window === 'undefined') return INITIAL_MEETING_NOTES;
  try {
    const raw = localStorage.getItem(MEETING_NOTES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MEETING_NOTES_STORAGE_KEY, JSON.stringify(INITIAL_MEETING_NOTES));
      return INITIAL_MEETING_NOTES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MEETING_NOTES;
  }
};

export const saveStoredMeetingNotes = (notes: MeetingNote[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MEETING_NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Error saving meeting notes to localStorage:', err);
  }
};
