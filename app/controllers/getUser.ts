import { createSupabaseServerClient } from "~/utils/supabase.server";

export const getUser = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  uuid: string,
) => {
  const { data, error } = await supabase.auth.admin.getUserById(uuid);

  if (error) {
    console.error(error);
    throw error;
  }

  return data.user;
};
