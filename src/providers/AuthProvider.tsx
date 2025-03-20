import { createContext, PropsWithChildren, useContext, useEffect, useState, useRef } from 'react'
import { View, Text } from 'react-native'
import { supabase } from '@/lib/client/supabase'
import { Session } from '@supabase/supabase-js';
import { Profile } from '../types'; // Import the proper Profile type

type AuthData = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  logout: () => Promise<{ success: boolean, error?: string }>;
}

const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
  error: null,
  logout: async () => ({ success: true })
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const prevSessionRef = useRef<Session | null>(null);
  
  // Add logout function
  const logout = async () => {
    try {
      // Set loading state only once
      setLoading(true);
      
      // Perform logout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }
      setSession(null);
      // Let the auth listener handle the state updates
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during logout';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error.message);
        setError(`Profile fetch error: ${error.message}`);
        return null;
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching profile';
      console.error('Profile fetch exception:', errorMessage);
      setError(errorMessage);
      return null;
    }
  };
  
  useEffect(() => {
    let mounted = true;
    
    const fetchSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(sessionError.message);
        }
        
        if (!mounted) return;
        
        setSession(session);    

        if (session?.user?.id) {
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown authentication error';
          console.error('Auth error:', errorMessage);
          setError(errorMessage);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchSession();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      // Prevent unnecessary updates if session is the same
      // This is crucial to avoid render loops
      if (JSON.stringify(session) === JSON.stringify(prevSessionRef.current)) return;
      
      // Set previous session reference in a state variable or ref
      setSession((prevSession) => {
        prevSessionRef.current = prevSession;
        return session;
      });
      
      // Update profile when session changes
      if (session?.user?.id) {
        try {
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        } catch (err) {
          if (mounted) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown profile error';
            console.error('Profile update error:', errorMessage);
            setError(errorMessage);
          }
        }
      } else {
        // Only set profile to null if it isn't already null
        setProfile((prev) => (prev ? null : prev));
      }
    });

    // Cleanup function
    return () => {
      mounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        loading, 
        profile, 
        isAdmin: profile?.group === 'ADMIN', 
        error,
        logout // Expose the logout function
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);