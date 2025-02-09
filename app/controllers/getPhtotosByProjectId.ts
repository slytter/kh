import { z } from "zod";
import { Photo } from "~/store/store";
import { PhotoSchema } from "~/types/validations";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const getPhotosByProjectId = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  projectId: number,
) => {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    console.error(error);
    throw error;
  }

  const photos = PhotoSchema.array().parse(data);

  return photos
};


export type Photo = z.infer<typeof PhotoSchema>;