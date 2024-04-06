import { createServerClient } from "@supabase/auth-helpers-remix";
import { createClient } from "@supabase/supabase-js";
import { Database } from "~/types/db.types";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabasePublicKey = process.env.SUPABASE_PUBLIC_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const createSupabaseServerClient = ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) =>
  createServerClient<Database>(supabaseUrl, supabasePublicKey, {
    request,
    response,
  });

export const createSuperbaseAdmin = () => {
  // Initialize the Supabase client with the service role key
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey);
};
