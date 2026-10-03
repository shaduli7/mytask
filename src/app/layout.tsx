import type { Metadata } from 'next';
import './globals.css';
import { TaskProvider } from '@/context/TaskContext';

export const metadata: Metadata = {
  title: 'MyTaskFlow - Personal Daily Task Management Dashboard',
  description: 'Manage daily work tasks, set color-coded priorities, track progress, and receive smart reminders with MyTaskFlow.',
  keywords: ['Task Manager', 'Productivity Dashboard', 'Daily Tasks', 'Priority Management', 'Reminders', 'Next.js'],
  authors: [{ name: 'Antigravity AI' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <TaskProvider>{children}</TaskProvider>
      </body>
    </html>
  );
}
