'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Sun,
  Moon,
  Download,
  Upload,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { requestNotificationPermission } from '@/services/notificationService';
import { Priority } from '@/types/task';

export const SettingsView = () => {
  const { settings, updateSettings, exportData, importData } = useTaskContext();

  const [userName, setUserName] = useState(settings.userName);
  const [email, setEmail] = useState(settings.email);
  const [defaultPriority, setDefaultPriority] = useState<Priority>(settings.defaultPriority);
  const [morningTime, setMorningTime] = useState(settings.morningReminderTime);
  const [eodTime, setEodTime] = useState(settings.eodSummaryTime);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName,
      email,
      defaultPriority,
      morningReminderTime: morningTime,
      eodSummaryTime: eodTime,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleEnableBrowserNotifs = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      updateSettings({ enableBrowserNotifications: true });
    } else {
      alert('Browser notification permission was denied in your browser settings.');
      updateSettings({ enableBrowserNotifications: false });
    }
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mytaskflow-personal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        setImportStatus('Personal tasks backup successfully restored!');
      } else {
        setImportStatus('Failed to parse backup JSON file.');
      }
      setTimeout(() => setImportStatus(''), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <span>Personal Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize your daily personal workspace, notification alarms, and backup data.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings successfully updated!</span>
        </div>
      )}

      {/* Profile */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-purple-600" />
          <span>Personal Profile</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Default Priority
              </label>
              <select
                value={defaultPriority}
                onChange={(e) => setDefaultPriority(e.target.value as Priority)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟠 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
          >
            Save Profile
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-600" />
          <span>Notification & Sound Alarms</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Browser Push Notifications</h3>
              <p className="text-slate-400 text-[11px]">Receive desktop popup alerts for task alarms</p>
            </div>
            <button
              onClick={handleEnableBrowserNotifs}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                settings.enableBrowserNotifications
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {settings.enableBrowserNotifications ? 'Enabled ✓' : 'Enable'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Audio Sound Alarms</h3>
              <p className="text-slate-400 text-[11px]">Play chime alert when a task alarm triggers</p>
            </div>
            <button
              onClick={() => updateSettings({ enableSoundAlerts: !settings.enableSoundAlerts })}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                settings.enableSoundAlerts
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {settings.enableSoundAlerts ? 'Enabled ✓' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-purple-600" />
          <span>Appearance</span>
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateSettings({ theme: 'light' })}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              settings.theme === 'light'
                ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 ring-2 ring-purple-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500 mb-2" />
            <span className="font-bold text-xs block text-slate-900 dark:text-white">Light Theme</span>
          </button>

          <button
            onClick={() => updateSettings({ theme: 'dark' })}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              settings.theme === 'dark'
                ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 ring-2 ring-purple-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400 mb-2" />
            <span className="font-bold text-xs block text-slate-900 dark:text-white">Dark Theme</span>
          </button>
        </div>
      </div>

      {/* Export / Import */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-purple-600" />
          <span>Data Backup</span>
        </h2>

        {importStatus && (
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-semibold">
            {importStatus}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Tasks JSON</span>
          </button>

          <label className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl cursor-pointer flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Restore JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
