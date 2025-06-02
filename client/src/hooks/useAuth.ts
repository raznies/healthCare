import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const { data: session } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user", session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) throw error;
      return user;
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!session?.user,
  };
}