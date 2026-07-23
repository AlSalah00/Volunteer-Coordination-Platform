import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getCurrentProfile } from "../services/profile";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let lastUserId = null;

    const syncProfile = async (nextUser) => {
      if (!nextUser) {
        lastUserId = null;
        if (isMounted) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      if (nextUser.id === lastUserId) {
        if (isMounted) setLoading(false);
        return;
      }

      lastUserId = nextUser.id;

      if (nextUser.user_metadata?.role && isMounted) {
        setLoading(false);
      } else if (isMounted) {
        setLoading(true);
      }

      const { data } = await getCurrentProfile();

      if (isMounted) {
        setProfile(data ?? null);
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const nextUser = session?.user ?? null;
      if (!isMounted) return;
      setUser(nextUser);
      await syncProfile(nextUser);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      if (!isMounted) return;
      setUser(nextUser);
      await syncProfile(nextUser);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getActiveRole = () => {
    if (profile?.role) return profile.role;
    if (user?.user_metadata?.role) return user.user_metadata.role;

    const cachedRole = localStorage.getItem("oauth_role_fallback");
    if (cachedRole && user) {
      localStorage.removeItem("oauth_role_fallback");
      return cachedRole;
    }

    return null;
  };

  const value = {
    user,
    profile,
    role: getActiveRole(),
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
