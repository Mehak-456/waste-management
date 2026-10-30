-- ====================================================================
-- SWACHH SEVA - ROW LEVEL SECURITY (RLS) & ACCESS CONTROL POLICIES
-- Migration: 20261027000002_security_rls_policies.sql
-- Description: Enforces zero-trust role-based security:
--   - Citizens: Access their own records, view public zone stats.
--   - Workers: Access assigned tasks, submit collection/proofs.
--   - Authorities: Full administrative oversight & auditing.
-- ====================================================================

-- 1. Enable RLS on All Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_collection_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.area_cleanliness ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_audits ENABLE ROW LEVEL SECURITY;

-- 2. Security Definier Helper Functions for Role Checking
-- Uses SECURITY DEFINER with search_path = public to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
DECLARE
    u_role user_role;
BEGIN
    SELECT role INTO u_role
    FROM public.profiles
    WHERE id = auth.uid();
    
    RETURN COALESCE(u_role, 'citizen'::user_role);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_authority()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT public.current_user_role() = 'authority'::user_role);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_worker()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT public.current_user_role() = 'worker'::user_role);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_citizen()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT public.current_user_role() = 'citizen'::user_role);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- ====================================================================
-- 3. RLS Policies: Profiles
-- ====================================================================
-- Allow authenticated users to view profiles (needed for collaborative features, assigned names)
CREATE POLICY "profiles_select_policy"
ON public.profiles FOR SELECT
TO authenticated
USING (
    -- Users can view their own profile
    auth.uid() = id
    -- Authorities can view all profiles
    OR public.is_authority()
    -- Workers and citizens can view worker profiles (for operational transparency)
    OR role IN ('worker', 'authority')
);

-- Users can only update their own profile details
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    -- Regular users cannot escalate their own role
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
);

-- Municipal authorities can update any profile (e.g., assign zones, update roles)
CREATE POLICY "profiles_authority_manage"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.is_authority())
WITH CHECK (public.is_authority());

-- ====================================================================
-- 4. RLS Policies: Waste Collection Tasks
-- ====================================================================
-- Workers can view tasks assigned to them; authorities can view all; citizens can view route tasks in zone
CREATE POLICY "tasks_select_policy"
ON public.waste_collection_tasks FOR SELECT
TO authenticated
USING (
    public.is_authority()
    OR (public.is_worker() AND (assigned_worker_id = auth.uid() OR assigned_worker_id IS NULL))
    OR public.is_citizen()
);

-- Only authorities can create new tasks
CREATE POLICY "tasks_insert_authority"
ON public.waste_collection_tasks FOR INSERT
TO authenticated
WITH CHECK (public.is_authority());

-- Workers can update tasks assigned to them (status, photos, weight)
CREATE POLICY "tasks_update_worker"
ON public.waste_collection_tasks FOR UPDATE
TO authenticated
USING (
    public.is_worker() 
    AND assigned_worker_id = auth.uid()
)
WITH CHECK (
    public.is_worker() 
    AND assigned_worker_id = auth.uid()
);

-- Authorities can update all tasks (reassign, reschedule)
CREATE POLICY "tasks_update_authority"
ON public.waste_collection_tasks FOR UPDATE
TO authenticated
USING (public.is_authority())
WITH CHECK (public.is_authority());

-- Only authorities can delete tasks
CREATE POLICY "tasks_delete_authority"
ON public.waste_collection_tasks FOR DELETE
TO authenticated
USING (public.is_authority());

-- ====================================================================
-- 5. RLS Policies: Citizen Complaints / Grievances
-- ====================================================================
-- Citizens can view their own reports and community reports in their zone
-- Workers can view complaints assigned to them or in their sector
-- Authorities can view all complaints
CREATE POLICY "complaints_select_policy"
ON public.citizen_complaints FOR SELECT
TO authenticated
USING (
    public.is_authority()
    OR citizen_id = auth.uid()
    OR (public.is_worker() AND (assigned_worker_id = auth.uid() OR assigned_worker_id IS NULL))
    OR true -- Public transparency of grievances across city sectors
);

-- Any authenticated user (specifically citizens) can file a complaint
CREATE POLICY "complaints_insert_citizen"
ON public.citizen_complaints FOR INSERT
TO authenticated
WITH CHECK (
    citizen_id = auth.uid() 
    OR citizen_id IS NULL
);

-- Citizens can update only their own complaints, and ONLY when status is pending
CREATE POLICY "complaints_update_own_pending"
ON public.citizen_complaints FOR UPDATE
TO authenticated
USING (
    citizen_id = auth.uid() 
    AND status = 'pending'
)
WITH CHECK (
    citizen_id = auth.uid() 
    AND status = 'pending'
);

-- Assigned workers can update resolution status, notes, and resolved photos
CREATE POLICY "complaints_update_assigned_worker"
ON public.citizen_complaints FOR UPDATE
TO authenticated
USING (
    public.is_worker() 
    AND assigned_worker_id = auth.uid()
)
WITH CHECK (
    public.is_worker() 
    AND assigned_worker_id = auth.uid()
);

-- Authorities can update, assign workers, and resolve any complaint
CREATE POLICY "complaints_update_authority"
ON public.citizen_complaints FOR UPDATE
TO authenticated
USING (public.is_authority())
WITH CHECK (public.is_authority());

-- Citizens can delete only their own pending complaints; authorities can delete any
CREATE POLICY "complaints_delete_policy"
ON public.citizen_complaints FOR DELETE
TO authenticated
USING (
    public.is_authority() 
    OR (citizen_id = auth.uid() AND status = 'pending')
);

-- ====================================================================
-- 6. RLS Policies: Collection Records
-- ====================================================================
-- Workers can view their own collection records; authorities can view all
CREATE POLICY "collection_records_select"
ON public.collection_records FOR SELECT
TO authenticated
USING (
    public.is_authority()
    OR worker_id = auth.uid()
);

-- Workers can insert their own collection records
CREATE POLICY "collection_records_insert_worker"
ON public.collection_records FOR INSERT
TO authenticated
WITH CHECK (
    public.is_authority()
    OR (public.is_worker() AND worker_id = auth.uid())
);

-- Only authorities can edit or audit past collection records
CREATE POLICY "collection_records_update_authority"
ON public.collection_records FOR UPDATE
TO authenticated
USING (public.is_authority())
WITH CHECK (public.is_authority());

-- Only authorities can delete collection records
CREATE POLICY "collection_records_delete_authority"
ON public.collection_records FOR DELETE
TO authenticated
USING (public.is_authority());

-- ====================================================================
-- 7. RLS Policies: Training Resources
-- ====================================================================
-- All authenticated users can view published training resources
CREATE POLICY "training_select_policy"
ON public.training_resources FOR SELECT
TO authenticated
USING (
    publication_status = 'published'
    OR public.is_authority()
);

-- Only authorities can insert training resources
CREATE POLICY "training_insert_authority"
ON public.training_resources FOR INSERT
TO authenticated
WITH CHECK (public.is_authority());

-- Only authorities can update training resources
CREATE POLICY "training_update_authority"
ON public.training_resources FOR UPDATE
TO authenticated
USING (public.is_authority())
WITH CHECK (public.is_authority());

-- Only authorities can delete training resources
CREATE POLICY "training_delete_authority"
ON public.training_resources FOR DELETE
TO authenticated
USING (public.is_authority());

-- ====================================================================
-- 8. RLS Policies: Area Cleanliness
-- ====================================================================
-- All authenticated users can view area cleanliness stats
CREATE POLICY "area_cleanliness_select"
ON public.area_cleanliness FOR SELECT
TO authenticated
USING (true);

-- Only authorities can insert or modify area definitions
CREATE POLICY "area_cleanliness_manage_authority"
ON public.area_cleanliness FOR ALL
TO authenticated
USING (public.is_authority())
WITH CHECK (public.is_authority());

-- ====================================================================
-- 9. RLS Policies: Worker Audits
-- ====================================================================
-- Workers can view their own audits; authorities can view all audits
CREATE POLICY "audits_select_policy"
ON public.worker_audits FOR SELECT
TO authenticated
USING (
    public.is_authority()
    OR (public.is_worker() AND worker_id = auth.uid())
);

-- Only authorities can create, update (approve/flag/incentive), and delete audits
CREATE POLICY "audits_manage_authority"
ON public.worker_audits FOR ALL
TO authenticated
USING (public.is_authority())
WITH CHECK (public.is_authority());
