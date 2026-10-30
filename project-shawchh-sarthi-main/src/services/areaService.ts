import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AreaCleanliness } from '../types';
import { mockAreas, voteAreaCleanliness as mockVoteArea } from '../data/mockData';
import type { Database } from '../types/database.types';

export const mapAreaRowToArea = (
  row: Database['public']['Tables']['area_cleanliness']['Row']
): AreaCleanliness => {
  return {
    id: row.id,
    name: row.name,
    zone: row.zone,
    ward: row.ward,
    cleanlinessScore: row.cleanliness_score,
    status: row.status as 'clean' | 'in-progress' | 'needs-attention',
    lastCleanedTime: new Date(row.last_cleaned_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    assignedWorkerName: 'Municipal Crew',
    assignedWorkerId: row.assigned_worker_id || 'SW-101',
    lat: row.lat,
    lng: row.lng,
    proofBefore: row.proof_before_url || undefined,
    proofAfter: row.proof_after_url || undefined,
    verifiedByCitizenCount: row.verified_by_citizen_count,
    totalReports: row.total_reports,
    nextScheduledCollection: row.next_scheduled_collection || 'Tomorrow 08:00 AM',
    wasteTypesCollected: row.waste_types_collected,
  };
};

export const getAreas = async (): Promise<{ data: AreaCleanliness[]; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { data: mockAreas };
  }

  try {
    const { data, error } = await supabase
      .from('area_cleanliness')
      .select('*')
      .order('cleanliness_score', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: mockAreas };
    }

    return { data: data.map(mapAreaRowToArea) };
  } catch (err: unknown) {
    return { data: mockAreas, error: (err as Error)?.message };
  }
};

export const voteArea = async (
  areaId: string,
  isClean: boolean
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    mockVoteArea(areaId, isClean);
    return { success: true };
  }

  try {
    const { error } = await supabase.rpc('vote_area_cleanliness', {
      p_area_id: areaId,
      p_is_clean: isClean,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Vote failed' };
  }
};
