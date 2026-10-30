import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TrainingVideo } from '../types';
import { mockTrainingVideos } from '../data/mockData';
import type { Database } from '../types/database.types';

export interface CreateTrainingParams {
  title: string;
  description: string;
  category: 'Safety' | 'Efficiency' | 'Emergency' | 'General';
  url: string;
  duration?: string;
  thumbnail?: string;
  publicationStatus?: 'published' | 'draft';
}

export const mapTrainingRowToVideo = (
  row: Database['public']['Tables']['training_resources']['Row']
): TrainingVideo => {
  return {
    id: row.id,
    title: row.title,
    duration: row.duration || '5:00',
    thumbnail: row.thumbnail_url || 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: row.description,
    category: row.category,
    url: row.content_url,
  };
};

export const getTrainingResources = async (
  includeDrafts: boolean = false
): Promise<{ data: TrainingVideo[]; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { data: mockTrainingVideos };
  }

  try {
    let query = supabase
      .from('training_resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeDrafts) {
      query = query.eq('publication_status', 'published');
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return { data: mockTrainingVideos };
    }

    return { data: data.map(mapTrainingRowToVideo) };
  } catch (err: unknown) {
    return { data: mockTrainingVideos, error: (err as Error)?.message };
  }
};

/**
 * Creates a new training module (Municipal Authority action)
 */
export const createTrainingResource = async (
  params: CreateTrainingParams
): Promise<{ success: boolean; data?: TrainingVideo; error?: string }> => {
  if (!isSupabaseConfigured()) {
    const newVideo: TrainingVideo = {
      id: `train-${Date.now()}`,
      title: params.title,
      description: params.description,
      category: params.category,
      duration: params.duration || '8:00',
      thumbnail: params.thumbnail || 'https://vincular.in/wp-content/uploads/2023/11/Know-your-waste.png',
      url: params.url,
    };
    mockTrainingVideos.unshift(newVideo);
    return { success: true, data: newVideo };
  }

  try {
    const insertPayload: Database['public']['Tables']['training_resources']['Insert'] = {
      title: params.title,
      description: params.description,
      category: params.category,
      content_url: params.url,
      duration: params.duration || '8:00',
      thumbnail_url: params.thumbnail || null,
      publication_status: params.publicationStatus || 'published',
    };

    const { data, error } = await supabase
      .from('training_resources')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: mapTrainingRowToVideo(data) };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to create training resource' };
  }
};

/**
 * Deletes a training module (Municipal Authority action)
 */
export const deleteTrainingResource = async (id: string): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    const idx = mockTrainingVideos.findIndex(v => v.id === id);
    if (idx !== -1) mockTrainingVideos.splice(idx, 1);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('training_resources')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to delete training resource' };
  }
};
