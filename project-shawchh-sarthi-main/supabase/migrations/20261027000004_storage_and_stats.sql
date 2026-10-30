-- ====================================================================
-- SWACHH SEVA - STORAGE BUCKET & OPERATIONAL LOGGING
-- Migration: 20261027000004_storage_and_stats.sql
-- Description: Configures the 'waste-evidence' storage bucket for 
--              grievance photos and task completion proofs.
-- ====================================================================

-- 1. Create Storage Bucket for Waste Evidences if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('waste-evidence', 'waste-evidence', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies
DO $$ BEGIN
    -- Policy: Public Read Access for Waste Evidence Photos
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Public Access to Waste Proofs'
    ) THEN
        CREATE POLICY "Public Access to Waste Proofs"
        ON storage.objects FOR SELECT
        TO public
        USING (bucket_id = 'waste-evidence');
    END IF;

    -- Policy: Authenticated Users can Upload Evidences
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Authenticated Users Upload Proofs'
    ) THEN
        CREATE POLICY "Authenticated Users Upload Proofs"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'waste-evidence');
    END IF;

    -- Policy: Users can delete their own uploaded objects
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Users Manage Own Proofs'
    ) THEN
        CREATE POLICY "Users Manage Own Proofs"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = 'waste-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;
END $$;
