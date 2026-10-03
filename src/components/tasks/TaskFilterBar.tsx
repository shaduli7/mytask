'use client';

import React from 'react';
import { Filter, ArrowUpDown, RefreshCw } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { Priority, Status } from '@/types/task';

const CATEGORIES = [
  'All',
  'Personal',
  'Work',
  'Health',
  'Shopping',
  'Finance',
  'Other',
];

export const TaskFilterBar = () => {
  const { filters, setFilters } = useTaskContext();

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      priority: 'All',
      status: 'All',
      category: 'All',
      dateRange: 'all',
      sortBy: 'deadline',
      sortOrder: 'asc',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs space-y-3 mb-6 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Filter & Sort Personal Tasks</span>
        </div>

        <button
          onClick={resetFilters}
          className="text-xs text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Priority Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Priority
          </label>
          <select
            value={filters.priority || 'All'}
            onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value as Priority | 'All' }))}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="All">All Priorities</option>
            <option value="High">🔴 High Priority</option>
            <option value="Medium">🟠 Medium Priority</option>
            <option value="Low">🟢 Low Priority</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Status
          </label>
          <select
            value={filters.status || 'All'}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as Status | 'All' }))}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="All">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Category
          </label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By & Order */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Sort By
          </label>
          <div className="flex items-center gap-1.5">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Creation Date</option>
              <option value="title">Title</option>
            </select>

            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
                }))
              }
              title={`Sort ${filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              className="p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-purple-400 rounded-xl text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
