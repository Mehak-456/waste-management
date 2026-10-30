import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';
import type { Database } from '../types/database.types';

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  mobile: string;
  zone?: string;
  role: 'citizen' | 'worker'; // Municipal authority registration is strictly forbidden
  workerId?: string;
}

export interface AuthResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  requiresEmailVerification?: boolean;
}

/**
 * Maps a database profile row to frontend User interface
 */
export const mapProfileToUser = (
  profile: Database['public']['Tables']['profiles']['Row'],
  email?: string
): User => {
  return {
    id: profile.id,
    fullName: profile.full_name,
    email: email || profile.email || undefined,
    role: profile.role,
    workerId: profile.worker_id || undefined,
    citizenId: profile.citizen_id || undefined,
    authorityId: profile.authority_id || undefined,
    mobile: profile.mobile || '',
    team: profile.team || undefined,
    zone: profile.zone || 'Sector A',
    department: profile.department || undefined,
    designation: profile.designation || undefined,
    joinDate: profile.join_date,
    lastCheckup: profile.last_checkup || undefined,
    healthStatus: profile.health_status || undefined,
  };
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true };
};

/**
 * Registers a new user with Supabase Auth
 * Enforces strict role guard: Municipal authorities cannot self-register!
 */
export const registerUser = async (params: SignUpParams): Promise<AuthResult<User>> => {
  // 1. Role Guard
  const rawRole = (params.role as string).toLowerCase();
  if (rawRole === 'authority' || rawRole === 'admin') {
    return {
      success: false,
      error: 'Security Violation: Municipal Authority accounts cannot be registered publicly. They must be provisioned directly by the Municipal Directorate.',
    };
  }

  // 2. Input Validation
  const emailVal = validateEmail(params.email);
  if (!emailVal.valid) return { success: false, error: emailVal.error };

  const passVal = validatePassword(params.password);
  if (!passVal.valid) return { success: false, error: passVal.error };

  if (!params.fullName.trim()) {
    return { success: false, error: 'Full name is required.' };
  }

  if (!params.mobile.trim()) {
    return { success: false, error: 'Mobile number is required.' };
  }

  if (params.role === 'worker' && params.workerId && !params.workerId.match(/^SW-\d+$/)) {
    return { success: false, error: 'Sanitation Worker ID must be in format SW-XXX (e.g., SW-101).' };
  }

  const defaultZone = params.zone || 'Sector A';
  const generatedWorkerId = params.role === 'worker' 
    ? (params.workerId || `SW-${Math.floor(100 + Math.random() * 900)}`)
    : undefined;
  const generatedCitizenId = params.role === 'citizen'
    ? `CZ-${Math.floor(100 + Math.random() * 900)}`
    : undefined;

  if (!isSupabaseConfigured()) {
    const localUser: User = {
      id: `usr-${Date.now()}`,
      fullName: params.fullName.trim(),
      email: params.email.trim(),
      role: params.role as UserRole,
      workerId: generatedWorkerId,
      citizenId: generatedCitizenId,
      mobile: params.mobile.trim(),
      zone: defaultZone,
      team: params.role === 'worker' ? 'Team Alpha' : undefined,
      joinDate: new Date().toISOString().split('T')[0],
      healthStatus: 'Good',
    };
    return {
      success: true,
      data: localUser,
      requiresEmailVerification: false,
    };
  }

  try {
    // 3. Supabase Auth Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: params.email.trim(),
      password: params.password,
      options: {
        data: {
          full_name: params.fullName.trim(),
          mobile: params.mobile.trim(),
          zone: defaultZone,
          role: params.role,
          worker_id: generatedWorkerId,
          citizen_id: generatedCitizenId,
        },
      },
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('already registered')) {
        return { success: false, error: 'An account with this email address already exists. Please log in instead.' };
      }
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Registration failed: No user returned by authentication provider.' };
    }

    // 4. Ensure profile row exists in public.profiles table
    const profileInsert = {
      id: authData.user.id,
      full_name: params.fullName.trim(),
      email: params.email.trim(),
      role: params.role as UserRole,
      worker_id: generatedWorkerId || null,
      citizen_id: generatedCitizenId || null,
      authority_id: null,
      mobile: params.mobile.trim(),
      zone: defaultZone,
      team: params.role === 'worker' ? 'Team Alpha' : null,
      join_date: new Date().toISOString().split('T')[0],
      health_status: 'Good',
    };

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert(profileInsert, { onConflict: 'id' })
      .select('*')
      .single();

    if (profileError) {
      console.warn('[authService] Profile upsert warning:', profileError.message);
    }

    // Check if email confirmation is required
    const requiresVerification = !authData.session;

    const mappedUser: User = profileData
      ? mapProfileToUser(profileData, params.email)
      : {
          id: authData.user.id,
          fullName: params.fullName,
          email: params.email,
          role: params.role,
          workerId: generatedWorkerId,
          citizenId: generatedCitizenId,
          mobile: params.mobile,
          zone: defaultZone,
          joinDate: new Date().toISOString().split('T')[0],
          healthStatus: 'Good',
        };

    return {
      success: true,
      data: mappedUser,
      requiresEmailVerification: requiresVerification,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: (err as Error)?.message || 'An unexpected error occurred during registration.',
    };
  }
};

/**
 * Logs in a user with email and password via Supabase Auth
 */
export const loginWithEmail = async (
  email: string,
  password: string,
  role?: UserRole
): Promise<AuthResult<User>> => {
  const emailVal = validateEmail(email);
  if (!emailVal.valid) return { success: false, error: emailVal.error };

  if (!password) {
    return { success: false, error: 'Password is required.' };
  }

  if (!isSupabaseConfigured()) {
    const normalized = email.trim().toLowerCase();
    const matched = mockUsers.find(
      u => (u.email && u.email.toLowerCase() === normalized) ||
           (u.mobile && u.mobile === email.trim()) ||
           (role && u.role === role)
    ) || mockUsers.find(u => u.role === (role || 'worker')) || mockUsers[0];

    return {
      success: true,
      data: matched,
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        return { success: false, error: 'Invalid email or password. Please verify your credentials and try again.' };
      }
      if (error.message.toLowerCase().includes('email not confirmed')) {
        return { success: false, error: 'Please check your email inbox to verify your account before logging in.' };
      }
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Login failed. User session could not be established.' };
    }

    // Fetch user profile from public.profiles table
    const profile = await fetchUserProfile(data.user.id);
    if (!profile) {
      // Fallback create basic profile from auth user metadata
      const meta = data.user.user_metadata || {};
      const fallbackUser: User = {
        id: data.user.id,
        fullName: meta.full_name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email,
        role: (meta.role as UserRole) || 'citizen',
        workerId: meta.worker_id,
        citizenId: meta.citizen_id,
        authorityId: meta.authority_id,
        mobile: meta.mobile || '',
        zone: meta.zone || 'Sector A',
        joinDate: new Date().toISOString().split('T')[0],
      };
      return { success: true, data: fallbackUser };
    }

    return {
      success: true,
      data: mapProfileToUser(profile, data.user.email),
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: (err as Error)?.message || 'Login failed due to an unexpected connection error.',
    };
  }
};

/**
 * Fetches user profile from database
 */
export const fetchUserProfile = async (
  userId: string
): Promise<Database['public']['Tables']['profiles']['Row'] | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (err) {
    console.error('[authService] Error fetching profile:', err);
    return null;
  }
};

/**
 * Logs out the current user session
 */
export const signOutUser = async (): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to sign out' };
  }
};

/**
 * Updates user profile in public.profiles table
 */
export const updateProfile = async (
  userId: string,
  updates: Partial<Database['public']['Tables']['profiles']['Update']>
): Promise<AuthResult<User>> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: mapProfileToUser(data),
    };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Failed to update profile.' };
  }
};
