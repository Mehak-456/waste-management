import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  loginWithEmail, 
  registerUser, 
  signOutUser, 
  fetchUserProfile, 
  mapProfileToUser, 
  updateProfile,
  SignUpParams, 
  AuthResult 
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  login: (email: string, password: string, role?: import('../types').UserRole) => Promise<AuthResult<User>>;
  signUp: (params: SignUpParams) => Promise<AuthResult<User>>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<AuthResult<User>>;
  setUserDirectlyForDemo: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const configured = isSupabaseConfigured();

  // Initialize and restore session from Supabase Auth or local demo state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (!configured) {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('swachh-seva-demo-user') : null;
        if (stored && mounted) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            // Ignore parse errors
          }
        }
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('[AuthContext] Session retrieval error:', error.message);
        }

        if (session?.user && mounted) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUser(mapProfileToUser(profile, session.user.email));
          } else {
            // User authenticated in auth.users, create state from metadata
            const meta = session.user.user_metadata || {};
            setUser({
              id: session.user.id,
              fullName: meta.full_name || session.user.email?.split('@')[0] || 'Authenticated User',
              email: session.user.email,
              role: meta.role || 'citizen',
              workerId: meta.worker_id,
              citizenId: meta.citizen_id,
              authorityId: meta.authority_id,
              mobile: meta.mobile || '',
              zone: meta.zone || 'Sector A',
              joinDate: new Date().toISOString().split('T')[0],
              healthStatus: 'Good'
            });
          }
        }
      } catch (err) {
        console.error('[AuthContext] Session initialization error:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes (token refresh, sign out, sign in)
    if (configured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              const profile = await fetchUserProfile(session.user.id);
              if (profile) {
                setUser(mapProfileToUser(profile, session.user.email));
              }
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        }
      );

      return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
      };
    } else {
      return () => {
        mounted = false;
      };
    }
  }, [configured]);

  // Supabase / Demo login
  const login = async (email: string, password: string, role?: import('../types').UserRole): Promise<AuthResult<User>> => {
    setIsLoading(true);
    try {
      const result = await loginWithEmail(email, password, role);
      if (result.success && result.data) {
        setUser(result.data);
        if (!configured && typeof window !== 'undefined') {
          localStorage.setItem('swachh-seva-demo-user', JSON.stringify(result.data));
        }
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Supabase / Demo registration
  const signUp = async (params: SignUpParams): Promise<AuthResult<User>> => {
    setIsLoading(true);
    try {
      const result = await registerUser(params);
      if (result.success && result.data && !result.requiresEmailVerification) {
        setUser(result.data);
        if (!configured && typeof window !== 'undefined') {
          localStorage.setItem('swachh-seva-demo-user', JSON.stringify(result.data));
        }
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (configured) {
        await signOutUser();
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('swachh-seva-demo-user');
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo user switch
  const setUserDirectlyForDemo = (demoUser: User | null) => {
    setUser(demoUser);
    if (typeof window !== 'undefined') {
      if (demoUser) {
        localStorage.setItem('swachh-seva-demo-user', JSON.stringify(demoUser));
      } else {
        localStorage.removeItem('swachh-seva-demo-user');
      }
    }
  };

  // Profile update
  const updateUserProfile = async (updates: Partial<User>): Promise<AuthResult<User>> => {
    if (!user) {
      return { success: false, error: 'User is not logged in.' };
    }

    if (!configured) {
      const updatedUser: User = {
        ...user,
        ...updates,
      };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('swachh-seva-demo-user', JSON.stringify(updatedUser));
      }
      return { success: true, data: updatedUser };
    }

    const dbUpdates = {
      full_name: updates.fullName,
      mobile: updates.mobile,
      zone: updates.zone,
      team: updates.team,
      health_status: updates.healthStatus,
    };

    const result = await updateProfile(user.id, dbUpdates);
    if (result.success && result.data) {
      setUser(prev => prev ? { ...prev, ...result.data } : null);
    }
    return result;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isConfigured: configured,
    login,
    signUp,
    logout,
    updateUserProfile,
    setUserDirectlyForDemo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};