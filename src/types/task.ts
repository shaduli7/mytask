export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'To Do' | 'In Progress' | 'Done';
export type RecurringOption = 'None' | 'Daily' | 'Weekly' | 'Monthly';

export type Category = 
  | 'Personal'
  | 'Work'
  | 'Health'
  | 'Shopping'
  | 'Finance'
  | 'Other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category | string;
  priority: Priority;
  status: Status;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  reminderDateTime?: string | null; // YYYY-MM-DDTHH:mm
  recurring: RecurringOption;
  createdAt: string; // ISO
  completedAt?: string | null; // ISO
  reminderSent?: boolean;
  snoozedUntil?: string | null; // ISO
}

export interface NotificationItem {
  id: string;
  taskId?: string;
  title: string;
  message: string;
  timestamp: string; // ISO
  type: 'reminder' | 'overdue' | 'morning_summary' | 'eod_summary' | 'info';
  read: boolean;
  snoozedUntil?: string | null;
}

export interface UserSettings {
  userName: string;
  email: string;
  defaultPriority: Priority;
  defaultReminderOffsetMinutes: number;
  enableBrowserNotifications: boolean;
  enableSoundAlerts: boolean;
  enableMorningReminder: boolean;
  enableEodSummary: boolean;
  morningReminderTime: string;
  eodSummaryTime: string;
  theme: 'light' | 'dark' | 'system';
  timeZone: string;
}

export interface TaskFilterOptions {
  searchQuery: string;
  priority?: Priority | 'All';
  status?: Status | 'All';
  category?: string | 'All';
  dateRange?: 'all' | 'today' | 'upcoming' | 'overdue' | 'completed';
  sortBy: 'priority' | 'deadline' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRatePercentage: number;
}

export interface BulletPointItem {
  id: string;
  text: string;
  completed?: boolean;
}

export interface MeetingNote {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  attendees?: string; // e.g. "John, Sarah, Rahul"
  category?: string; // e.g. "Project", "Client", "1-on-1", "Team"
  summaryParagraph?: string; // Paragraph content / overview notes
  bulletPoints: BulletPointItem[]; // Bullet points / action items / takeaways list
  createdAt: string;
  updatedAt?: string;
}
