import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CitizenReport } from '../types';
import { mockCitizenReports, addCitizenReport as addMockReport } from '../data/mockData';
import type { Database } from '../types/database.types';

export const mapComplaintRowToReport = (
  row: Database['public']['Tables']['citizen_complaints']['Row']
): CitizenReport => {
  return {
    id: row.id,
    citizenId: row.citizen_id || 'CZ-ANON',
    citizenName: row.citizen_name,
    citizenMobile: row.citizen_mobile || '',
    location: row.location,
    zone: row.zone,
    issueType: row.category,
    description: row.description,
    photo: row.image_url || undefined,
    timestamp: row.created_at,
    status: row.status,
    assignedToWorker: row.assigned_worker_id || undefined,
    resolvedPhoto: row.resolved_image_url || undefined,
    resolutionNotes: row.resolution_notes || undefined,
  };
};

/**
 * Fetches complaints with optional citizen or zone filter
 */
export const getComplaints = async (
  citizenId?: string,
  zone?: string
): Promise<{ data: CitizenReport[]; error?: string }> => {
  if (!isSupabaseConfigured()) {
    let filtered = [...mockCitizenReports];
    if (citizenId) {
      filtered = filtered.filter(c => c.citizenId === citizenId || citizenId.startsWith('CZ-'));
    }
    return { data: filtered };
  }

  try {
    let query = supabase
      .from('citizen_complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (citizenId) {
      query = query.eq('citizen_id', citizenId);
    } else if (zone) {
      query = query.eq('zone', zone);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('[complaintService] Error fetching complaints:', error.message);
      return { data: mockCitizenReports, error: error.message };
    }

    if (!data || data.length === 0) {
      return { data: [] };
    }

    return { data: data.map(mapComplaintRowToReport) };
  } catch (err: unknown) {
    return { data: mockCitizenReports, error: (err as Error)?.message };
  }
};

/**
 * Submits a new citizen complaint to Supabase
 */
export const submitComplaint = async (
  report: Omit<CitizenReport, 'id' | 'timestamp' | 'status'> & { citizenId?: string }
): Promise<{ success: boolean; data?: CitizenReport; error?: string }> => {
  if (!isSupabaseConfigured()) {
    const newReport: CitizenReport = {
      ...report,
      id: `CR-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    addMockReport(newReport);
    return { success: true, data: newReport };
  }

  try {
    const insertPayload: Database['public']['Tables']['citizen_complaints']['Insert'] = {
      citizen_id: report.citizenId && report.citizenId.includes('-') && report.citizenId.length > 20 ? report.citizenId : null,
      citizen_name: report.citizenName,
      citizen_mobile: report.citizenMobile || null,
      category: report.issueType,
      description: report.description,
      location: report.location,
      zone: report.zone,
      image_url: report.photo || null,
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('citizen_complaints')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: mapComplaintRowToReport(data) };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to submit complaint' };
  }
};

/**
 * Assigns a complaint to a worker (Municipal Authority action)
 */
export const assignComplaintWorker = async (
  complaintId: string,
  workerId: string,
  workerName: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    const r = mockCitizenReports.find(c => c.id === complaintId);
    if (r) {
      r.status = 'assigned';
      r.assignedToWorker = `${workerName} (${workerId})`;
    }
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('citizen_complaints')
      .update({
        assigned_worker_id: workerId.includes('-') && workerId.length > 20 ? workerId : null,
        status: 'assigned',
        resolution_notes: `Assigned to ${workerName}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', complaintId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to assign worker' };
  }
};

/**
 * Updates a citizen complaint status & resolution
 */
export const updateComplaint = async (
  complaintId: string,
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved',
  notes?: string,
  resolvedPhotoUrl?: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    const r = mockCitizenReports.find(c => c.id === complaintId);
    if (r) {
      r.status = status;
      if (notes) r.resolutionNotes = notes;
      if (resolvedPhotoUrl) r.resolvedPhoto = resolvedPhotoUrl;
    }
    return { success: true };
  }

  try {
    const updates: Database['public']['Tables']['citizen_complaints']['Update'] = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (notes) updates.resolution_notes = notes;
    if (resolvedPhotoUrl) updates.resolved_image_url = resolvedPhotoUrl;

    const { error } = await supabase
      .from('citizen_complaints')
      .update(updates)
      .eq('id', complaintId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to update complaint' };
  }
};

/**
 * Deletes a complaint (Authority or Citizen owner if pending)
 */
export const deleteComplaint = async (complaintId: string): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    const idx = mockCitizenReports.findIndex(c => c.id === complaintId);
    if (idx !== -1) mockCitizenReports.splice(idx, 1);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('citizen_complaints')
      .delete()
      .eq('id', complaintId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to delete complaint' };
  }
};
