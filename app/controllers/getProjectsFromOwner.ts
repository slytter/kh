import { createSupabaseServerClient } from "~/utils/supabase.server";

export const getProjectsFromOwner = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  owner: string,
) => {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner", owner);

  if (error) {
    console.error(error);
    throw error;
  }

  return projects;
};
