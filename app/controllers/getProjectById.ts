import assert from "assert";
import { ProjectSchema } from "~/types/validations";
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

  console.log(project);

  const validProject = ProjectSchema.parse(project);
  // asset validProject.id is a number
  assert(validProject.id === projectId);

  return validProject;
};
