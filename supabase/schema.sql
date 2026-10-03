-- MyTaskFlow Supabase PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor to enable cloud sync and authentication for MyTaskFlow

-- 1. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    project_name TEXT NOT NULL DEFAULT 'General',
    category TEXT NOT NULL DEFAULT 'Other',
    priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    status TEXT NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Done')),
    due_date DATE NOT NULL,
    due_time TIME,
    reminder_date_time TIMESTAMP WITH TIME ZONE,
    recurring TEXT NOT NULL DEFAULT 'None' CHECK (recurring IN ('None', 'Daily', 'Weekly', 'Monthly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    snoozed_until TIMESTAMP WITH TIME ZONE
);

-- Indexing for fast dashboard & filtering queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);

-- Enable RLS on tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tasks"
    ON public.tasks FOR ALL
    USING (auth.uid() = user_id);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#8b5cf6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
    ON public.projects FOR ALL
    USING (auth.uid() = user_id);

-- 3. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id);

-- 4. User Settings Table
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT,
    default_priority TEXT DEFAULT 'Medium',
    default_reminder_offset INTEGER DEFAULT 15,
    enable_browser_notifications BOOLEAN DEFAULT TRUE,
    enable_sound_alerts BOOLEAN DEFAULT TRUE,
    enable_morning_reminder BOOLEAN DEFAULT TRUE,
    enable_eod_summary BOOLEAN DEFAULT TRUE,
    morning_reminder_time TIME DEFAULT '08:00',
    eod_summary_time TIME DEFAULT '18:00',
    theme TEXT DEFAULT 'light',
    time_zone TEXT DEFAULT 'UTC',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own settings"
    ON public.user_settings FOR ALL
    USING (auth.uid() = user_id);
