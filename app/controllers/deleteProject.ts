import { createSupabaseServerClient } from "~/utils/supabase.server";

// This function deletes a project and all of its photos from the database.
export const deleteProject = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  projectId: number,
  ownerId: string,
) => {
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .match({ id: projectId });

  if (projectError) {
    console.error(projectError);
    throw projectError;
  }

  if (projectData[0].owner !== ownerId) {
    throw new Error("You are not the owner of this project");
  }
  const { data: photoData, error: photoError } = await supabase
    .from("photos")
    .delete()
    .match({ project_id: projectId });

  const { data, error } = await supabase
    .from("projects")
    .delete()
    .match({ id: projectId });

  if (error) {
    console.error(error);
    throw error;
  }

  if (photoError) {
    console.error(photoError);
    throw photoError;
  }

  return { data, photoData };
};
