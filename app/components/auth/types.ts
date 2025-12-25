import { AuthError } from "@supabase/supabase-js";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";

export type ProviderProps = {
  setError: (error: AuthError | null) => void;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  auth: SupabaseAuthClient;
  message?: string;
};
