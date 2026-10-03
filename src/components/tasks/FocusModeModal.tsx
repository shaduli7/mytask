'use client';

import React, { useState, useEffect } from 'react';
import { Target, X, CheckCircle, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';

export const FocusModeModal = () => {
  const { isFocusModeOpen, closeFocusMode, focusTask, toggleTaskComplete } = useTaskContext();

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setSecondsLeft(25 * 60);
    setIsRunning(false);
  }, [focusTask]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, secondsLeft]);

  if (!isFocusModeOpen || !focusTask) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleComplete = () => {
    toggleTaskComplete(focusTask.id);
    closeFocusMode();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 text-white flex flex-col items-center justify-between p-8 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
          <Target className="w-5 h-5 animate-pulse" />
          <span>Personal Focus Mode</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-purple-400" />}
          </button>

          <button
            onClick={closeFocusMode}
            className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Exit Focus Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl text-center space-y-8 my-auto">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-semibold">
            <span>{focusTask.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {focusTask.title}
          </h1>

          {focusTask.description && (
            <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
              {focusTask.description}
            </p>
          )}
        </div>

        {/* Countdown */}
        <div className="py-6">
          <div className="text-7xl sm:text-8xl font-mono font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500">
            {formattedTime}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsLeft(25 * 60);
              }}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={handleComplete}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 mx-auto transition-all cursor-pointer"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Mark Task Completed</span>
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Single personal task focus environment
      </div>
    </div>
  );
};
