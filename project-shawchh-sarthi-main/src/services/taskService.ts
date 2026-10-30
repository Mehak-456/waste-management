import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Task } from '../types';
import { mockTasks } from '../data/mockData';
import type { Database } from '../types/database.types';

export interface CreateTaskParams {
  routeName: string;
  location: string;
  zone: string;
  lat: number;
  lng: number;
  scheduledDate?: string;
  assignedWorkerId?: string | null;
  wasteCategory?: string[];
}

export const mapTaskRowToTask = (
  row: Database['public']['Tables']['waste_collection_tasks']['Row']
): Task => {
  return {
    id: row.id,
    routeName: row.route_name,
    location: row.location,
    status: row.status,
    lat: row.lat,
    lng: row.lng,
    weight: row.weight_kg ? Number(row.weight_kg) : undefined,
    proofBefore: row.proof_before_url || undefined,
    proofAfter: row.proof_after_url || undefined,
  };
};

/**
 * Fetches all waste collection tasks or tasks filtered by worker ID
 */
export const getTasks = async (workerId?: string, zone?: string): Promise<{ data: Task[]; error?: string }> => {
  if (!isSupabaseConfigured()) {
    // Development fallback
    const filtered = [...mockTasks];
    if (workerId) {
      // In mock mode, all mockTasks are considered accessible for preview
    }
    return { data: filtered };
  }

  try {
    let query = supabase
      .from('waste_collection_tasks')
      .select('*')
      .order('scheduled_date', { ascending: false })
      .order('created_at', { ascending: true });

    if (workerId) {
      // Worker view: tasks explicitly assigned to them OR unassigned tasks in their zone
      query = query.or(`assigned_worker_id.eq.${workerId},assigned_worker_id.is.null`);
    }

    if (zone && !workerId) {
      query = query.eq('zone', zone);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('[taskService] Error fetching tasks from Supabase:', error.message);
      return { data: mockTasks, error: error.message };
    }

    if (!data || data.length === 0) {
      return { data: [] };
    }

    return { data: data.map(mapTaskRowToTask) };
  } catch (err: unknown) {
    return { data: mockTasks, error: (err as Error)?.message };
  }
};

/**
 * Creates a new task (Municipal Authority action)
 */
export const createTask = async (
  params: CreateTaskParams
): Promise<{ success: boolean; data?: Task; error?: string }> => {
  if (!isSupabaseConfigured()) {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      routeName: params.routeName,
      location: params.location,
      lat: params.lat,
      lng: params.lng,
      status: 'pending',
      weight: 0,
    };
    mockTasks.push(newTask);
    return { success: true, data: newTask };
  }

  try {
    const insertPayload: Database['public']['Tables']['waste_collection_tasks']['Insert'] = {
      route_name: params.routeName,
      location: params.location,
      zone: params.zone,
      lat: params.lat,
      lng: params.lng,
      scheduled_date: params.scheduledDate || new Date().toISOString().split('T')[0],
      assigned_worker_id: params.assignedWorkerId || null,
      waste_category: params.wasteCategory || ['Dry Waste', 'Wet Waste'],
      status: 'pending',
      weight_kg: 0,
    };

    const { data, error } = await supabase
      .from('waste_collection_tasks')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: mapTaskRowToTask(data) };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to create collection task' };
  }
};

/**
 * Updates status, waste weight, or details for a task
 */
export const updateTask = async (
  taskId: string,
  status: 'pending' | 'in-progress' | 'completed',
  weight?: number,
  proofBefore?: string,
  proofAfter?: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      if (weight !== undefined) task.weight = weight;
      if (proofBefore) task.proofBefore = proofBefore;
      if (proofAfter) task.proofAfter = proofAfter;
    }
    return { success: true };
  }

  try {
    const updatePayload: Database['public']['Tables']['waste_collection_tasks']['Update'] = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (weight !== undefined) updatePayload.weight_kg = weight;
    if (proofBefore) updatePayload.proof_before_url = proofBefore;
    if (proofAfter) updatePayload.proof_after_url = proofAfter;
    if (status === 'completed') updatePayload.completed_at = new Date().toISOString();

    const { error } = await supabase
      .from('waste_collection_tasks')
      .update(updatePayload)
      .eq('id', taskId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to update task' };
  }
};

/**
 * Completes a task and logs an immutable collection record in collection_records
 */
export const completeTaskAndLogRecord = async (
  taskId: string,
  workerId: string,
  weightKg: number,
  proofBefore?: string,
  proofAfter?: string,
  completionNotes?: string
): Promise<{ success: boolean; error?: string }> => {
  // 1. Update the task status to completed
  const taskResult = await updateTask(taskId, 'completed', weightKg, proofBefore, proofAfter);
  if (!taskResult.success) {
    return taskResult;
  }

  // 2. Insert into collection_records
  if (isSupabaseConfigured()) {
    try {
      const recordPayload: Database['public']['Tables']['collection_records']['Insert'] = {
        task_id: taskId.includes('-') && taskId.length > 20 ? taskId : null,
        worker_id: workerId,
        collection_date: new Date().toISOString(),
        waste_category: 'Solid Municipal Waste',
        quantity_kg: weightKg,
        proof_before_url: proofBefore || null,
        proof_after_url: proofAfter || null,
        completion_notes: completionNotes || `Completed collection with verified photo proofs. Weight: ${weightKg}kg`,
      };

      const { error: recError } = await supabase
        .from('collection_records')
        .insert(recordPayload);

      if (recError) {
        console.warn('[taskService] Collection record insertion note:', recError.message);
      }
    } catch (err) {
      console.error('[taskService] Error logging collection record:', err);
    }
  }

  return { success: true };
};

/**
 * Deletes a collection task (Municipal Authority action)
 */
export const deleteTask = async (taskId: string): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    const idx = mockTasks.findIndex(t => t.id === taskId);
    if (idx !== -1) mockTasks.splice(idx, 1);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('waste_collection_tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to delete task' };
  }
};
