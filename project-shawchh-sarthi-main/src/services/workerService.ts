import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, WorkerAuditRecord } from '../types';
import { mockUsers, mockWorkerAudits } from '../data/mockData';
import type { Database } from '../types/database.types';

export const getRegisteredWorkers = async (): Promise<{ data: User[]; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { data: mockUsers.filter(u => u.role === 'worker') };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'worker')
      .order('full_name', { ascending: true });

    if (error) {
      console.warn('[workerService] Error fetching workers:', error.message);
      return { data: mockUsers.filter(u => u.role === 'worker') };
    }

    if (!data || data.length === 0) {
      return { data: mockUsers.filter(u => u.role === 'worker') };
    }

    const mapped: User[] = data.map(p => ({
      id: p.id,
      fullName: p.full_name,
      email: p.email || undefined,
      role: 'worker',
      workerId: p.worker_id || undefined,
      mobile: p.mobile || '',
      team: p.team || undefined,
      zone: p.zone,
      joinDate: p.join_date,
      lastCheckup: p.last_checkup || undefined,
      healthStatus: p.health_status || undefined,
    }));

    return { data: mapped };
  } catch (err: unknown) {
    return { data: mockUsers.filter(u => u.role === 'worker'), error: (err as Error)?.message };
  }
};

export const getWorkerAudits = async (
  workerId?: string
): Promise<{ data: WorkerAuditRecord[]; error?: string }> => {
  if (!isSupabaseConfigured()) {
    let list = [...mockWorkerAudits];
    if (workerId) {
      list = list.filter(a => a.workerId === workerId);
    }
    return { data: list };
  }

  try {
    let query = supabase.from('worker_audits').select('*, profiles:worker_id(full_name, worker_id, zone)');
    if (workerId) {
      query = query.eq('worker_id', workerId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return { data: mockWorkerAudits };
    }

    const mapped: WorkerAuditRecord[] = (data as Array<Database['public']['Tables']['worker_audits']['Row'] & { profiles?: { full_name?: string; worker_id?: string; zone?: string } | null }>).map((row) => ({
      workerId: row.profiles?.worker_id || row.worker_id,
      workerName: row.profiles?.full_name || 'Sanitation Worker',
      zone: row.zone || row.profiles?.zone || 'Sector A',
      tasksAssigned: row.tasks_assigned,
      tasksCompleted: row.tasks_completed,
      totalWeightKg: Number(row.total_weight_kg),
      photoComplianceScore: row.photo_compliance_score,
      auditStatus: row.audit_status,
      calculatedIncentive: Number(row.calculated_incentive),
    }));

    return { data: mapped };
  } catch (err: unknown) {
    return { data: mockWorkerAudits, error: (err as Error)?.message };
  }
};

export const updateAuditStatus = async (
  workerId: string,
  status: 'approved' | 'flagged' | 'under-review',
  incentive?: number
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    const audit = mockWorkerAudits.find(a => a.workerId === workerId);
    if (audit) {
      audit.auditStatus = status;
      if (incentive !== undefined) audit.calculatedIncentive = incentive;
    }
    return { success: true };
  }

  try {
    const updates: Database['public']['Tables']['worker_audits']['Update'] = {
      audit_status: status,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (incentive !== undefined) updates.calculated_incentive = incentive;

    const { error } = await supabase
      .from('worker_audits')
      .update(updates)
      .eq('worker_id', workerId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to update audit' };
  }
};
