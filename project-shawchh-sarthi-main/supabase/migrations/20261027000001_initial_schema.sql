-- ====================================================================
-- SWACHH SEVA - DATABASE SCHEMA MIGRATION
-- Migration: 20261027000001_initial_schema.sql
-- Description: Creates initial PostgreSQL extensions, enums, tables,
--              constraints, foreign keys, indexes, and triggers.
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Define Custom Enums
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('citizen', 'worker', 'authority');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('pending', 'in-progress', 'completed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'complaint_category') THEN
        CREATE TYPE complaint_category AS ENUM (
            'overflowing-bin', 
            'garbage-dump', 
            'blocked-drain', 
            'missed-pickup', 
            'other'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'complaint_status') THEN
        CREATE TYPE complaint_status AS ENUM ('pending', 'assigned', 'in-progress', 'resolved');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_status') THEN
        CREATE TYPE audit_status AS ENUM ('approved', 'under-review', 'flagged');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'training_category') THEN
        CREATE TYPE training_category AS ENUM ('Safety', 'Efficiency', 'Emergency', 'General');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publication_status') THEN
        CREATE TYPE publication_status AS ENUM ('published', 'draft', 'archived');
    END IF;
END $$;

-- 3. Utility Function: Automatic Updated Timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- 4. Entity: User Profiles
-- Maps to Supabase auth.users for RBAC & profile management
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    role user_role NOT NULL DEFAULT 'citizen',
    worker_id TEXT UNIQUE,
    citizen_id TEXT UNIQUE,
    authority_id TEXT UNIQUE,
    mobile TEXT,
    zone TEXT NOT NULL DEFAULT 'Sector A',
    team TEXT,
    department TEXT,
    designation TEXT,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_checkup DATE,
    health_status TEXT DEFAULT 'Good',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_zone ON public.profiles(zone);
CREATE INDEX IF NOT EXISTS idx_profiles_worker_id ON public.profiles(worker_id);
CREATE INDEX IF NOT EXISTS idx_profiles_citizen_id ON public.profiles(citizen_id);
CREATE INDEX IF NOT EXISTS idx_profiles_authority_id ON public.profiles(authority_id);

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatic trigger to populate public.profiles when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role user_role;
    custom_worker_id TEXT;
    custom_citizen_id TEXT;
    custom_authority_id TEXT;
BEGIN
    -- Extract role from metadata, defaulting to 'citizen'
    assigned_role := COALESCE(
        (NEW.raw_user_meta_data->>'role')::user_role,
        'citizen'
    );

    IF assigned_role = 'worker' THEN
        custom_worker_id := COALESCE(
            NEW.raw_user_meta_data->>'worker_id', 
            'SW-' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0')
        );
    ELSIF assigned_role = 'citizen' THEN
        custom_citizen_id := COALESCE(
            NEW.raw_user_meta_data->>'citizen_id', 
            'CZ-' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0')
        );
    ELSIF assigned_role = 'authority' THEN
        custom_authority_id := COALESCE(
            NEW.raw_user_meta_data->>'authority_id', 
            'MUNI-' || LPAD(FLOOR(RANDOM() * 90 + 10)::TEXT, 2, '0')
        );
    END IF;

    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        role,
        worker_id,
        citizen_id,
        authority_id,
        mobile,
        zone,
        team,
        department,
        designation,
        join_date,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'New User'),
        NEW.email,
        assigned_role,
        custom_worker_id,
        custom_citizen_id,
        custom_authority_id,
        NEW.raw_user_meta_data->>'mobile',
        COALESCE(NEW.raw_user_meta_data->>'zone', 'Sector A'),
        NEW.raw_user_meta_data->>'team',
        NEW.raw_user_meta_data->>'department',
        NEW.raw_user_meta_data->>'designation',
        CURRENT_DATE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users (Supabase native auth table)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ====================================================================
-- 5. Entity: Waste Collection Tasks
-- Tasks assigned to sanitation workers with GPS, photos, & status
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.waste_collection_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_name TEXT NOT NULL,
    location TEXT NOT NULL,
    zone TEXT NOT NULL DEFAULT 'Sector A',
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    waste_category TEXT[] NOT NULL DEFAULT ARRAY['Dry Waste', 'Wet Waste'],
    scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    assigned_worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status task_status NOT NULL DEFAULT 'pending',
    weight_kg NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (weight_kg >= 0),
    proof_before_url TEXT,
    proof_after_url TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_worker ON public.waste_collection_tasks(assigned_worker_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.waste_collection_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON public.waste_collection_tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_tasks_zone ON public.waste_collection_tasks(zone);

CREATE OR REPLACE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON public.waste_collection_tasks
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- 6. Entity: Citizen Complaints / Grievances
-- Submitted by citizens, tracked by authorities, assigned to workers
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.citizen_complaints (
    id TEXT PRIMARY KEY DEFAULT ('CR-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || SUBSTRING(gen_random_uuid()::TEXT, 1, 4)),
    citizen_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    citizen_name TEXT NOT NULL,
    citizen_mobile TEXT,
    category complaint_category NOT NULL DEFAULT 'overflowing-bin',
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    zone TEXT NOT NULL DEFAULT 'Sector A',
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    image_url TEXT,
    status complaint_status NOT NULL DEFAULT 'pending',
    assigned_worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolved_image_url TEXT,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON public.citizen_complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_worker ON public.citizen_complaints(assigned_worker_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.citizen_complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_zone ON public.citizen_complaints(zone);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON public.citizen_complaints(created_at DESC);

CREATE OR REPLACE TRIGGER trg_complaints_updated_at
BEFORE UPDATE ON public.citizen_complaints
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- 7. Entity: Collection Records
-- Audit log of completed collections, waste weight, and verification
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.collection_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.waste_collection_tasks(id) ON DELETE SET NULL,
    worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    collection_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    waste_category TEXT NOT NULL,
    quantity_kg NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (quantity_kg >= 0),
    proof_before_url TEXT,
    proof_after_url TEXT,
    completion_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collection_worker ON public.collection_records(worker_id);
CREATE INDEX IF NOT EXISTS idx_collection_task ON public.collection_records(task_id);
CREATE INDEX IF NOT EXISTS idx_collection_date ON public.collection_records(collection_date DESC);

-- ====================================================================
-- 8. Entity: Training Resources
-- Educational videos, safety modules, and standard operating procedures
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.training_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content_url TEXT NOT NULL,
    duration TEXT,
    thumbnail_url TEXT,
    category training_category NOT NULL DEFAULT 'Safety',
    publication_status publication_status NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_training_category ON public.training_resources(category);
CREATE INDEX IF NOT EXISTS idx_training_status ON public.training_resources(publication_status);

CREATE OR REPLACE TRIGGER trg_training_updated_at
BEFORE UPDATE ON public.training_resources
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- 9. Supportive Entity: Area Cleanliness Monitoring
-- City-wide area cleanliness scores, wards, and public verification
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.area_cleanliness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    zone TEXT NOT NULL,
    ward TEXT NOT NULL,
    cleanliness_score INT NOT NULL DEFAULT 85 CHECK (cleanliness_score BETWEEN 0 AND 100),
    status TEXT NOT NULL DEFAULT 'clean' CHECK (status IN ('clean', 'in-progress', 'needs-attention')),
    last_cleaned_time TIMESTAMPTZ DEFAULT NOW(),
    assigned_worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    proof_before_url TEXT,
    proof_after_url TEXT,
    verified_by_citizen_count INT NOT NULL DEFAULT 0 CHECK (verified_by_citizen_count >= 0),
    total_reports INT NOT NULL DEFAULT 0 CHECK (total_reports >= 0),
    next_scheduled_collection TEXT,
    waste_types_collected TEXT[] NOT NULL DEFAULT ARRAY['Dry Waste', 'Wet Waste'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_area_zone ON public.area_cleanliness(zone);
CREATE INDEX IF NOT EXISTS idx_area_status ON public.area_cleanliness(status);

CREATE OR REPLACE TRIGGER trg_area_updated_at
BEFORE UPDATE ON public.area_cleanliness
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- 10. Supportive Entity: Worker Audits & Incentive Records
-- Municipal authority review records, photo compliance, and wage incentives
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.worker_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    audit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    zone TEXT NOT NULL,
    tasks_assigned INT NOT NULL DEFAULT 0 CHECK (tasks_assigned >= 0),
    tasks_completed INT NOT NULL DEFAULT 0 CHECK (tasks_completed >= 0),
    total_weight_kg NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (total_weight_kg >= 0),
    photo_compliance_score INT NOT NULL DEFAULT 90 CHECK (photo_compliance_score BETWEEN 0 AND 100),
    audit_status audit_status NOT NULL DEFAULT 'under-review',
    calculated_incentive NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (calculated_incentive >= 0),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audits_worker ON public.worker_audits(worker_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON public.worker_audits(audit_status);
CREATE INDEX IF NOT EXISTS idx_audits_date ON public.worker_audits(audit_date DESC);

CREATE OR REPLACE TRIGGER trg_audits_updated_at
BEFORE UPDATE ON public.worker_audits
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- 11. RPC: Atomic Cleanliness Voting by Citizens
-- ====================================================================
CREATE OR REPLACE FUNCTION public.vote_area_cleanliness(p_area_id UUID, p_is_clean BOOLEAN)
RETURNS VOID AS $$
BEGIN
    IF p_is_clean THEN
        UPDATE public.area_cleanliness
        SET 
            verified_by_citizen_count = verified_by_citizen_count + 1,
            cleanliness_score = LEAST(100, cleanliness_score + 1),
            updated_at = NOW()
        WHERE id = p_area_id;
    ELSE
        UPDATE public.area_cleanliness
        SET 
            cleanliness_score = GREATEST(20, cleanliness_score - 4),
            status = CASE WHEN cleanliness_score - 4 < 70 THEN 'needs-attention' ELSE status END,
            updated_at = NOW()
        WHERE id = p_area_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
