'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle, Clock, AlertCircle, Award } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';

export const AnalyticsView = () => {
  const { tasks, stats } = useTaskContext();

  // 1. Priority Breakdown Data
  const highCount = tasks.filter((t) => t.priority === 'High').length;
  const medCount = tasks.filter((t) => t.priority === 'Medium').length;
  const lowCount = tasks.filter((t) => t.priority === 'Low').length;

  const priorityData = [
    { name: 'High Priority', value: highCount, color: '#ef4444' },
    { name: 'Medium Priority', value: medCount, color: '#f97316' },
    { name: 'Low Priority', value: lowCount, color: '#10b981' },
  ];

  // 2. Status Breakdown Data
  const statusData = [
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#f59e0b' },
    { name: 'Pending', value: stats.pendingTasks, color: '#64748b' },
    { name: 'Overdue', value: stats.overdueTasks, color: '#ef4444' },
  ];

  // 3. Category Breakdown Data
  const categories = ['SEO', 'Content Writing', 'Keyword Research', 'Technical SEO', 'Client Reporting', 'Meetings', 'Other'];
  const categoryData = categories.map((cat) => ({
    name: cat,
    total: tasks.filter((t) => t.category === cat).length,
    completed: tasks.filter((t) => t.category === cat && t.status === 'Done').length,
  }));

  // 4. Weekly Productivity Trend Data (Sample baseline + calculated)
  const weeklyTrendData = [
    { day: 'Mon', completed: 4, pending: 2 },
    { day: 'Tue', completed: 6, pending: 3 },
    { day: 'Wed', completed: 5, pending: 1 },
    { day: 'Thu', completed: 8, pending: 4 },
    { day: 'Fri', completed: 7, pending: 2 },
    { day: 'Sat', completed: 3, pending: 1 },
    { day: 'Sun', completed: 5, pending: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <span>Productivity & Workload Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Visual insights into your task completion velocity, priority distribution, and weekly trends.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Completion Rate</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.completionRatePercentage}%
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Tasks Completed</span>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.completedTasks}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Active & Pending</span>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats.pendingTasks + stats.inProgressTasks}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Overdue Tasks</span>
            <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">
              {stats.overdueTasks}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Productivity Trend Line Chart */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Weekly Completion Velocity</span>
            </h3>
            <span className="text-[11px] text-slate-400">Tasks per day</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed Tasks"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#7c3aed' }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  name="Pending Tasks"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Priority Weight Distribution
            </h3>
            <span className="text-[11px] text-slate-400">Task priority breakdown</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Workload by Category
            </h3>
            <span className="text-[11px] text-slate-400">Total vs Completed by Category</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="total" name="Total Tasks" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" name="Completed Tasks" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
