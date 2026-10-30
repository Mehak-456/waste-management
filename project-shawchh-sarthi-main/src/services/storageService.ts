import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Service to handle image uploads for waste proofs, grievances, and thumbnails
 * Uses Supabase Storage bucket 'waste-evidence' with safe Base64 fallback.
 */
export const uploadImage = async (
  file: File,
  folder: 'grievances' | 'task-proofs' | 'training' = 'grievances'
): Promise<{ success: boolean; url: string; error?: string }> => {
  // If Supabase is not configured or in offline preview, convert to Base64 data URL
  if (!isSupabaseConfigured()) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ success: true, url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ success: false, url: '', error: 'Failed to read image file.' });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    // Attempt upload to Supabase Storage bucket 'waste-evidence'
    const { error: uploadError } = await supabase.storage
      .from('waste-evidence')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.warn('[storageService] Storage bucket upload note:', uploadError.message, '- Falling back to Base64 data URL.');
      // Graceful fallback to data URL if bucket is not created yet
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ success: true, url: reader.result as string });
        };
        reader.onerror = () => {
          resolve({ success: false, url: '', error: uploadError.message });
        };
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from('waste-evidence')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (err: unknown) {
    console.error('[storageService] Upload error:', err);
    // Safe fallback to data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ success: true, url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ success: false, url: '', error: err?.message || 'Upload failed' });
      };
      reader.readAsDataURL(file);
    });
  }
};
