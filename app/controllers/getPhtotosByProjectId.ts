import { createSupabaseServerClient } from "~/utils/supabase.server";

export const getPhotosByProjectId = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  projectId: number,
) => {
  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    console.error(error);
    throw error;
  }

  return photos;
};
