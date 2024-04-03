import { createSupabaseServerClient } from "~/utils/supabase.server";

export const getProjectById = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  projectId: number,
) => {
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return project;
};
