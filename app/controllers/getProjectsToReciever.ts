import { createSupabaseServerClient } from "~/utils/supabase.server";

export const getProjectsToReciever = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  reciever: string,
) => {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .contains("receivers", [reciever]);

  if (error) {
    console.error(error);
    throw error;
  }

  return projects;
};

