import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PerformanceData, LeaderboardEntry } from '../types';
import { mockPerformanceData, mockLeaderboard } from '../data/mockData';

export interface WorkerStats {
  totalAssignedTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
  totalWeightKg: number;
}

export interface AuthorityCityStats {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  totalTasks: number;
  completedTasks: number;
  registeredWorkersCount: number;
  totalWasteWeightKg: number;
  avgCleanlinessScore: number;
}

/**
 * Calculates live stats for a sanitation worker from database records
 */
export const getWorkerDashboardStats = async (workerId?: string): Promise<WorkerStats> => {
  if (!isSupabaseConfigured() || !workerId) {
    return {
      totalAssignedTasks: 5,
      completedTasks: 2,
      pendingTasks: 3,
      completionPercentage: 40,
      totalWeightKg: 43,
    };
  }

  try {
    const { data: tasks, error } = await supabase
      .from('waste_collection_tasks')
      .select('id, status, weight_kg, assigned_worker_id')
      .or(`assigned_worker_id.eq.${workerId},assigned_worker_id.is.null`);

    if (error || !tasks) {
      return { totalAssignedTasks: 0, completedTasks: 0, pendingTasks: 0, completionPercentage: 0, totalWeightKg: 0 };
    }

    const totalAssignedTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
    const completionPercentage = totalAssignedTasks > 0 ? Math.round((completedTasks / totalAssignedTasks) * 100) : 0;
    const totalWeightKg = tasks.reduce((sum, t) => sum + (Number(t.weight_kg) || 0), 0);

    return {
      totalAssignedTasks,
      completedTasks,
      pendingTasks,
      completionPercentage,
      totalWeightKg,
    };
  } catch (err) {
    console.error('[statsService] Error computing worker stats:', err);
    return { totalAssignedTasks: 0, completedTasks: 0, pendingTasks: 0, completionPercentage: 0, totalWeightKg: 0 };
  }
};

/**
 * Calculates city-wide municipal dashboard statistics
 */
export const getAuthorityCityStats = async (): Promise<AuthorityCityStats> => {
  if (!isSupabaseConfigured()) {
    return {
      totalComplaints: 3,
      pendingComplaints: 2,
      resolvedComplaints: 1,
      totalTasks: 5,
      completedTasks: 2,
      registeredWorkersCount: 5,
      totalWasteWeightKg: 183,
      avgCleanlinessScore: 85,
    };
  }

  try {
    const [complaintsRes, tasksRes, workersRes, areasRes] = await Promise.all([
      supabase.from('citizen_complaints').select('id, status'),
      supabase.from('waste_collection_tasks').select('id, status, weight_kg'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'worker'),
      supabase.from('area_cleanliness').select('cleanliness_score'),
    ]);

    const complaints = complaintsRes.data || [];
    const tasks = tasksRes.data || [];
    const areas = areasRes.data || [];

    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
    const pendingComplaints = totalComplaints - resolvedComplaints;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalWasteWeightKg = tasks.reduce((sum, t) => sum + (Number(t.weight_kg) || 0), 0);

    const registeredWorkersCount = workersRes.count || 0;

    const avgCleanlinessScore = areas.length > 0
      ? Math.round(areas.reduce((sum, a) => sum + a.cleanliness_score, 0) / areas.length)
      : 85;

    return {
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalTasks,
      completedTasks,
      registeredWorkersCount,
      totalWasteWeightKg,
      avgCleanlinessScore,
    };
  } catch (err) {
    console.error('[statsService] Error computing city stats:', err);
    return {
      totalComplaints: 0,
      pendingComplaints: 0,
      resolvedComplaints: 0,
      totalTasks: 0,
      completedTasks: 0,
      registeredWorkersCount: 0,
      totalWasteWeightKg: 0,
      avgCleanlinessScore: 0,
    };
  }
};

/**
 * Calculates weekly performance chart data from actual collection records
 */
export const getWeeklyPerformanceData = async (
  workerId?: string
): Promise<{ data: PerformanceData[]; totalCollections: number; totalWeight: number }> => {
  if (!isSupabaseConfigured()) {
    const totalCollections = mockPerformanceData.reduce((sum, d) => sum + d.collections, 0);
    const totalWeight = mockPerformanceData.reduce((sum, d) => sum + d.weight, 0);
    return { data: mockPerformanceData, totalCollections, totalWeight };
  }

  try {
    let query = supabase.from('collection_records').select('*');
    if (workerId) {
      query = query.eq('worker_id', workerId);
    }

    const { data: records, error } = await query;

    if (error || !records || records.length === 0) {
      // Return empty chart state when no records exist
      return { data: [], totalCollections: 0, totalWeight: 0 };
    }

    // Days map
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayStats: Record<string, { collections: number; weight: number }> = {
      Mon: { collections: 0, weight: 0 },
      Tue: { collections: 0, weight: 0 },
      Wed: { collections: 0, weight: 0 },
      Thu: { collections: 0, weight: 0 },
      Fri: { collections: 0, weight: 0 },
      Sat: { collections: 0, weight: 0 },
      Sun: { collections: 0, weight: 0 },
    };

    let totalCollections = 0;
    let totalWeight = 0;

    records.forEach(rec => {
      const date = new Date(rec.collection_date);
      const dayName = days[date.getDay()];
      if (dayStats[dayName]) {
        dayStats[dayName].collections += 1;
        dayStats[dayName].weight += Number(rec.quantity_kg) || 0;
        totalCollections += 1;
        totalWeight += Number(rec.quantity_kg) || 0;
      }
    });

    const chartData: PerformanceData[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      collections: dayStats[day].collections,
      weight: Math.round(dayStats[day].weight),
    }));

    return { data: chartData, totalCollections, totalWeight };
  } catch (err) {
    console.error('[statsService] Error fetching weekly performance:', err);
    return { data: [], totalCollections: 0, totalWeight: 0 };
  }
};

/**
 * Fetches real leaderboard rankings from database audits or collection records
 */
export const getLeaderboardData = async (): Promise<LeaderboardEntry[]> => {
  if (!isSupabaseConfigured()) {
    return mockLeaderboard;
  }

  try {
    const { data: audits, error } = await supabase
      .from('worker_audits')
      .select('worker_id, tasks_completed, calculated_incentive, profiles:worker_id(full_name)')
      .order('tasks_completed', { ascending: false })
      .limit(5);

    if (error || !audits || audits.length === 0) {
      return mockLeaderboard;
    }

    return (audits as Array<{ worker_id: string; tasks_completed: number; calculated_incentive: number; profiles: { full_name?: string } | null }>).map((a, idx) => ({
      rank: idx + 1,
      name: a.profiles?.full_name || `Sanitation Worker #${idx + 1}`,
      collections: a.tasks_completed,
      points: Math.round(Number(a.calculated_incentive) * 10),
    }));
  } catch {
    return mockLeaderboard;
  }
};
